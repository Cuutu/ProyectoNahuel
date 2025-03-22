const User = require('../models/User');

exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated() || req.session && req.session.user) {
        return next();
    }
    
    // Redirigir al login si no está autenticado
    res.redirect('/auth/login');
};

const checkSmartMoneySubscription = async (req, res, next) => {
    // Lista de rutas excluidas de la verificación de Smart Money
    const excludedRoutes = [
        '/api/user/profile-image',
        '/api/user/profile',  // Por si agregas más funcionalidades básicas del perfil
        '/dashboard'          // La vista del dashboard básico
    ];

    // Si la ruta está en la lista de excluidas, continuar sin verificar
    if (excludedRoutes.some(route => req.url.startsWith(route))) {
        return next();
    }

    try {
        const user = await User.findById(req.user._id);
        
        if (!user.membresias?.smartMoney || 
            !user.membresias.vencimientoSmartMoney || 
            new Date(user.membresias.vencimientoSmartMoney) < new Date()) {
            
            // Si es una petición API, devolver error JSON
            if (req.url.startsWith('/api')) {
                return res.status(403).json({ 
                    error: 'Requiere suscripción Smart Money',
                    redirect: '/planes/smart-money'
                });
            }
            
            // Si es una petición normal, redirigir
            return res.redirect('/planes/smart-money');
        }
        
        next();
    } catch (error) {
        console.error('Error al verificar suscripción:', error);
        res.status(500).json({ error: 'Error al verificar suscripción' });
    }
}; 