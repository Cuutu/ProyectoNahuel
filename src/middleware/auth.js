const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
};

const loadUser = (req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
};

module.exports = { isAuthenticated, loadUser }; 