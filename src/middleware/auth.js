const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        req.session.touch();
        res.locals.user = req.session.user;
        return next();
    }
    res.redirect('/auth/login');
};

const sessionPersist = (req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.user = req.session.user;
        req.session.touch();
    }
    next();
};

module.exports = { isAuthenticated, sessionPersist }; 