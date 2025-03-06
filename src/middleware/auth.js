const User = require('../models/User');

const isAuthenticated = (req, res, next) => {
    // Verificar si la ruta actual es de autenticación o vista previa
    if (req.path.startsWith('/auth') || req.path.startsWith('/preview') || req.path === '/') {
        return next();
    }
    
    // Verificar si el usuario está autenticado
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    
    if (req.session && req.session.user) {
        req.session.touch();
        res.locals.user = req.session.user;
        return next();
    }
    
    // Añadir la URL original como query parameter para redirigir después del login
    const returnTo = req.originalUrl;
    res.redirect(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`);
};

const sessionPersist = (req, res, next) => {
    // Debug de sesión
    console.log('=== Session Persist Check ===');
    console.log('Session:', req.session);
    console.log('User:', req.session?.user);
    
    if (req.session && req.session.user) {
        // Renovar la sesión
        req.session.touch();
        res.locals.user = req.session.user;
        res.locals.isAuthenticated = true;
    } else {
        res.locals.isAuthenticated = false;
    }
    next();
};

const isAdmin = async (req, res, next) => {
    // Verificar si la ruta actual es de autenticación
    if (req.path.startsWith('/auth')) {
        return next();
    }
    
    // Verificar si el usuario está autenticado
    if (!req.session.user) {
        const returnTo = req.originalUrl;
        return res.redirect(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`);
    }
    
    try {
        const user = await User.findById(req.session.user.id);
        if (!user || !user.isAdmin) {
            return res.status(403).render('error', {
                message: 'Acceso no autorizado'
            });
        }
        next();
    } catch (error) {
        console.error('Error en middleware admin:', error);
        res.status(500).render('error', {
            message: 'Error al verificar permisos'
        });
    }
};

module.exports = {
    isAuthenticated,
    sessionPersist,
    isAdmin
}; 