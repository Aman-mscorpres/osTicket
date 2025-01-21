const jwt = require("jsonwebtoken");
const moment = require("moment");
const { MainDB } = require("../CONFIGS/db");

module.exports.isBlackList = async function (req, res, next) {
  try {
    const token = req.headers["x-csrf-token"];

    if (!token) {
      return res.status(403).send({ success: false, message: "Token identification failed. Please login again..." });
    }

    const blackLists = await MainDB.query(`SELECT * FROM black_list_token WHERE token = :token`, {
      replacements: {
        token: token,
      },
      type: MainDB.QueryTypes.SELECT,
    });

    if (blackLists.length > 0) {
      return res.status(403).send({ success: false, message: "Token blacklisted. Cannot use this token. Please login again..." });
    } else {
      jwt.verify(token, `${process.env.TOKEN_SECRET}`, async function (err, decoded) {
        if (err) {
          return res.status(403).send({ success: false, message: "Token authentication failed. Please login again..." });
        }

        try {
          const loginLog = await MainDB.query(`SELECT * FROM user_login_log WHERE user_id = :user_id AND token_id = :token`, {
            replacements: {
              user_id: decoded.userID,
              token: decoded.token_id,
            },
            type: MainDB.QueryTypes.SELECT,
          });

          if (loginLog.length > 0) {
            if (loginLog[0].token_deleted == true) {
              const blackList = await MainDB.query(`INSERT INTO black_list_token (token , created_at) VALUES (:token , :created_at)`, {
                replacements: {
                  token: token,
                  created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                },
                type: MainDB.QueryTypes.INSERT,
              });

              return res.status(403).send({ success: false, message: "Token blacklisted. Cannot use this token. Please login again..." });
            }
          }
        } catch (err) {
          next(err);
        }
      });

      next();
    }
  } catch (err) {
    next(err);
  }
};
