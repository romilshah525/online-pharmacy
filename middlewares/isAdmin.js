module.exports = (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  }
  req.flash("error", "You need to be admin to view it!");
  res.redirect("/medicine-list");
};
