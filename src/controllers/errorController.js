const errorController = {
    renderError: (err, req, res, next) => {
        console.error(err);
        res.status(err.status || 500).render('error', {
            message: err.message || 'Ha ocurrido un error',
            error: process.env.NODE_ENV === 'development' ? err : {},
            user: req.user || req.session.user || null,
            isAuthenticated: req.isAuthenticated?.() || !!req.session.user
        });
    }
};

module.exports = errorController; 