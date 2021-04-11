exports.get404 = (req, res, next) => {
  // req.flash('error','Unknwon error has occured');
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    mainContent: "Page Does Not Exist",
  });
};
