const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        req.session.touch();
        res.locals.user = req.session.user;
        return next();
    }
    res.redirect('/auth/login');
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
    if (!req.session.user) {
        return res.redirect('/auth/login');
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