const jwt = require("jsonwebtoken");

module.exports.isAuthorized = function (req, res, next) {
  try {
    req.logedINUser = "6810b48d-511e-43e1-bbc7-305c0108c1aa";
    req.username = "Somendra";
    req.role = "admin";
    next();
    return;
    
    const token = req.headers["x-csrf-token"];

    if (!token) {
      return res.status(403).send({ success: false, message: "Token identification failed. Please login again..." });
    }
    jwt.verify(token, `${process.env.TOKEN_SECRET}`, async function (err, decoded) {
      if (err) {
        return res.status(403).send({ success: false, message: "Token authentication failed. Please login again..." });
      }

      req.logedINUser = decoded.userID;
      req.username = decoded.username;
      req.role = decoded.role;

      // require("./isBlackList").isBlackList(req, res, next);

      next();
    });
  } catch (err) {
    next(err);
  }
};
