const isAdmin = (req, res, next) => {
    // Verificar si el usuario está autenticado y es admin
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    
    // Si no es admin, redirigir al home o mostrar error
    res.status(403).render('error', {
        message: 'Acceso denegado. Se requieren permisos de administrador.',
        user: req.user
    });
};

module.exports = isAdmin; 