const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        req.session.returnTo = req.originalUrl;
        return res.redirect('/auth/login');
    }
    next();
};

const loadUser = (req, res, next) => {
    res.locals.user = req.session.user || null;
    if (req.session.user) {
        req.session.touch();
    }
    next();
};

module.exports = { isAuthenticated, loadUser }; 