exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated() || req.session && req.session.user) {
        return next();
    }
    
    // Redirigir al login si no está autenticado
    res.redirect('/auth/login');
}; 