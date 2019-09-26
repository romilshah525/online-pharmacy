module.exports = (req, res, next ) => {
    if(!req.session.user.isAdmin && !req.session.isLoggedIn) {
        return res.redirect('/login');
    } else {
        next();
    }
}