module.exports = (req, res, next) => {
    console.log(`\n-----------\n`);
    console.log(req.user);
    console.log(`\n-----------\n`);
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}