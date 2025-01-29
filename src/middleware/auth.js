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

module.exports = { isAuthenticated, sessionPersist }; 