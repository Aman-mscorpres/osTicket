module.exports.isAdmin = function (req, res, next) {

  if (req.role != "admin") {
    return res.status(403).send({ success: false, message: "You are not an authorized user" });
  }

  next();
};
