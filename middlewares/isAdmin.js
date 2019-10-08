module.exports = (req, res, next ) => {
    if(req.user.isAdmin) {
        return next();
    }
    res.redirect('/medicine-list');
}