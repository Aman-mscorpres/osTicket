const express = require("express");
const url = require("url");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const rsa = require("node-rsa");
const fs = require("fs");
const helper = require("../../HELPERS/index");
const publicKey = new rsa();
const public = fs.readFileSync("./keys/public.pem", "utf8");
publicKey.importKey(public);

let { MainDB } = require("../../CONFIGS/db");

router.post("/signIn", async (req, res) => {
  try {
    const user = req.body;

    if (!user.email || !user.password) {
      return res.status(400).json({ success: false, message: "Email and password are required!", code: "500" });
    }

    let result = await MainDB.query("SELECT * FROM `tbl_users` WHERE `email` = :data", {
      replacements: { data: user.email },
      type: MainDB.QueryTypes.SELECT,
    });

    if (result.length === 0) {
      return res.status(400).json({ success: false, message: "No account found with the provided credentials", code: "500" });
    } else {
      const userpassword_hash = await bcrypt.compare(user.password, result[0].pass);
      if (userpassword_hash || (result[0].temp_password === user.password && result[0].temp_password !== "--")) {
        // Cookies expire time
        let timeCalculation = 24 * 60 * 60 * 1000; // 24h

        const token = jwt.sign({ email: result[0].email, user: result[0].user }, process.env.TOKEN_SECRET, { expiresIn: timeCalculation });

        const encrypted = publicKey.encrypt(token, "base64");

        res.cookie("cookieToken", encrypted, { maxAge: timeCalculation, httpOnly: true }).json({
          data: {
            token: encrypted,
            user: result[0].user,
            email: result[0].email,
            validity: timeCalculation,
          },
          message: "Login successful. Please wait, we're gathering your information...",
          status: "success",
          success: true,
          code: 200,
        });
        return;
      } else {
        return res.status(400).json({ status: "error", success: false, message: "Invalid username or password combination", code: "500" });
      }
    }
  } catch (error) {
    res.status(500).json({ status: "error", success: false, message: "Something went wrong. Please contact the developer.", code: "500", error: error.stack });
    return;
  }
});

router.post("/signOut", (req, res) => {
  try {
    res.clearCookie("cookieToken");

    res.status(200).json({
      success: true,
      message: "Signout successful, you have been logged out.",
      code: 200,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during signout. Please try again.",
      code: 500,
      error: error.stack,
    });
  }
});

router.post("/forgot_password", async (req, res) => {
  try {
    let validator = new Validator(req.body, {
      email: "required|email",
      otp: "required",
      new_password: "required",
    })
    if (validator.fails()) {
      return res.json({ status:"error",success: false, message:Object.values(validator.errors.all())[0][0], code: 500 });
    }

    if (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(req.body.new_password)) {
      return res.json({
        status:"error",success: false,
        message: "Password does not meet the required pattern (must be at least 8 characters long, with at least 1 uppercase letter, 1 lowercase letter, 1 special character [!@#$%^&*]).",
        code: 500,
      });
    }

    let result = await MainDB.query("SELECT * FROM `tbl_users` WHERE `email` = :email", {
      replacements: { email: req.body.email },
      type: MainDB.QueryTypes.SELECT,
    });
    if(result[0].otp!==req.body.otp){
      return res.json({ status:"error",success: false, message: "Invalid OTP", code: 500 });
    }

    if (result.length == 0) {
      return res.json({ status:"error",success: false, message: "No account found with the provided email.", code: 500 });
    }

    let update_pass = await MainDB.query("UPDATE `tbl_users` SET `pass` = :password WHERE `email` = :email", {
      replacements: {
        email: req.body.email,
        password: await bcrypt.hash(req.body.new_password, 10),
      },
      type: MainDB.QueryTypes.UPDATE,
    });

    if (!update_pass[1]) {
      return res.json({ status:"error",success: false, message: "Error while updating password.", code: 200 });
    }

    return res.json({ status:"success",success: true, message: "Password reset successfully.",code: 200 });
  } catch (error) {
    return res.json({ status:"error",success: false, message: "Internal error, please contact support.", error: error.stack });
  }
});

// Route to send OTP to email
router.post("/forgot_password_otp", async (req, res) => {
  try {
    let validator=new Validator(req.body, {
      email: "required",
    });
    if (validator.fails()) {
      return res.json({ code:500,status: "error", message: {msg: Object.values(validator.errors.all())[0][0]} });
    }

    let result = await MainDB.query("SELECT * FROM `tbl_users` WHERE `email` = :email", {
      replacements: { email: req.body.email },
      type: MainDB.QueryTypes.SELECT,
    });
    if (result.length === 0) {  
      return res.json({code:500, status: "error", message:{msg: "No account found with the provided email."} });
    }

    let otp=Math.floor(100000 + Math.random() * 900000);
  let setOtp=  await MainDB.query("UPDATE `tbl_users` SET `otp` = :otp WHERE `email` = :email", {
      replacements: {
        email: req.body.email,
        otp: otp,
      },
      type: MainDB.QueryTypes.UPDATE,
    });
    if(!setOtp[1])
    {
      return res.json({code:500, status: "error", message:{msg: "Error while sending OTP."} });
    }

      helper.sendMail(req.body.email, "Forgot Password", "OTP : " + result[0].otp);
      return res.json({ code: 200, status: "success", message: { msg: "OTP has been sent to your email." } });
  
  }

  catch (error) {
    return helper.crashRes(res, error, { routeName: "forgotPasswordOTP" });
  }
});

module.exports = router;
