const express = require("express");
const router = express.Router();
let { MainDB } = require("../../CONFIGS/db");
const auth = require("../../MIDDLEWARES/auth");
const Validator = require("validatorjs");
const helper = require("../../HELPERS/index");
const moment = require("moment");

//Email banning
router.post("/banEmail", [auth.isAuthorized], async (req, res, next) => {
  try {
    let validator = new Validator(req.body, {
      email: "required",
    });
    if (validator.fails()) {
      return res.json({ code: 500, status: "error", message: Object.values(validator.errors.all())[0][0] });
    }
    let stmt = await MainDB.query("SELECT email FROM `tbl_banned_emails` WHERE email = :email", {
      replacements: {
        email: req.body.email,
      },
      type: MainDB.QueryTypes.SELECT,
    });
    if (stmt.length > 0) {
      return res.json({ code: 500, status: "error", message: { msg: "Email already banned" } });
    } else {
      let stmt0 = await MainDB.query("INSERT INTO `tbl_banned_emails` (email,banned_by,dt) VALUES (:email,:banned_by,:dt)", {
        replacements: {
          email: req.body.email,
          banned_by: req.user.user,
          dt: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
        type: MainDB.QueryTypes.INSERT,
      });
      if (stmt0.length > 0) {
        return res.json({ code: 200, status: "success", message: "Email banned successfully" });
      }

      return res.json({ code: 500, status: "error", message: {msg: "Error while banning email"} });
    }
  } catch (err) {
    next(err);
    helper.crashRes(res, err, { routeName: "banEmail" });
  }
});

//Ban IP
router.post("/banIP", [auth.isAuthorized], async (req, res, next) => {
  try {
    let validator = new Validator(req.body, {
      ip: "required",
    });
    if (validator.fails()) {
      return res.json({ code: 500, status: "error", message: Object.values(validator.errors.all())[0][0] });
    }
    let stmt = await MainDB.query("SELECT ip FROM `tbl_banned_ips` WHERE ip = :ip", {
      replacements: {
        ip: req.body.ip,
      },
      type: MainDB.QueryTypes.SELECT,
    });
    if (stmt.length > 0) {
      return res.json({ code: 500, status: "error", message: { msg: "IP already banned" } });
    } else {
      let stmt0 = await MainDB.query("INSERT INTO `tbl_banned_ips` (ip,banned_by,dt) VALUES (:ip,:banned_by,:dt)", {
        replacements: {
          ip: req.body.ip,  
          banned_by: req.user.user,
          dt: moment().format("YYYY-MM-DD HH:mm:ss"),   
        },
        type: MainDB.QueryTypes.INSERT,
      });
      if (stmt0.length > 0) {   
        return res.json({ code: 200, status: "success", message: "IP banned successfully" });
      }

      return res.json({ code: 500, status: "error", message: {msg: "Error while banning IP"} });    
    }
  } catch (err) {
    next(err);
    helper.crashRes(res, err, { routeName: "banIP" });
  }
});

module.exports = router;