// Middleware para verificar si el usuario tiene una suscripción activa a Smart Money
const hasSmartMoneySubscription = (req, res, next) => {
    try {
        const user = req.user || (req.session && req.session.user);
        
        // Para depuración
        console.log('Verificando suscripción Smart Money para:', {
            url: req.url,
            method: req.method,
            user: user ? user._id : 'No user'
        });
        
        // Verificar si el usuario tiene una suscripción específica a Smart Money (valor 'pro' ahora significa Smart Money)
        if (user && user.membresias && 
            user.membresias.alertas === 'pro' && 
            user.membresias.vencimientoAlertas && new Date(user.membresias.vencimientoAlertas) > new Date()) {
            console.log('Usuario tiene suscripción activa a Smart Money');
            return next();
        }
        
        console.log('Usuario no tiene suscripción activa a Smart Money, redirigiendo');
        // Si no tiene suscripción, redirigir a la página de suscripción
        return res.redirect('/alertas/smart-money?subscription=required');
    } catch (error) {
        console.error('Error en middleware hasSmartMoneySubscription:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al verificar la suscripción'
        });
    }
};

module.exports = hasSmartMoneySubscription; 