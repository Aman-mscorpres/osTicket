module.exports.notGuest = function (req, res, next) {
  if (req.role == "guest") {
    return res.status(403).send({ success: false, message: "You are not an authorized user" });
  }

  next();
};
