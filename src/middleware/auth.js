const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
};

const loadUser = (req, res, next) => {
    if (req.session.user) {
        res.locals.user = {
            id: req.session.user.id,
            nombre: req.session.user.nombre,
            apellido: req.session.user.apellido,
            email: req.session.user.email
        };
    } else {
        res.locals.user = null;
    }
    next();
};

module.exports = { isAuthenticated, loadUser }; 