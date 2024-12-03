const sessionCheck = (req, res, next) => {
    // Log del estado actual de la sesión
    console.log('=== Session Check ===');
    console.log('Session exists:', !!req.session);
    console.log('Session ID:', req.sessionID);
    console.log('User in session:', req.session?.user);
    console.log('Cookies:', req.headers.cookie);
    console.log('==================');

    if (req.session && req.session.user) {
        // Renovar la sesión si existe
        req.session.touch();
    }
    next();
};

module.exports = sessionCheck; 