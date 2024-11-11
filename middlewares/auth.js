const asyncHandler = require("express-async-handler");

exports.isAllowed = asyncHandler(async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
});
