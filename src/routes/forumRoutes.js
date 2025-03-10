const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

// Middleware para verificar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() || (req.session && req.session.user)) {
        return next();
    }
    res.redirect('/auth/login');
};

// Middleware para verificar si el usuario tiene una suscripción activa a Trader Call
const hasTraderCallSubscription = (req, res, next) => {
    try {
        const user = req.user || (req.session && req.session.user);
        
        // Para depuración
        console.log('Verificando suscripción para:', {
            url: req.url,
            method: req.method,
            user: user ? user._id : 'No user'
        });
        
        // Verificar si el usuario tiene una suscripción activa a Trader Call
        if (user && user.membresias && 
            (user.membresias.alertas === 'premium' || user.membresias.alertas === 'pro') && 
            user.membresias.vencimientoAlertas && new Date(user.membresias.vencimientoAlertas) > new Date()) {
            console.log('Usuario tiene suscripción activa');
            return next();
        }
        
        console.log('Usuario no tiene suscripción activa, redirigiendo');
        // Si no tiene suscripción, redirigir a la página de suscripción
        return res.redirect('/alertas/trader-call?subscription=required');
    } catch (error) {
        console.error('Error en middleware hasTraderCallSubscription:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al verificar la suscripción'
        });
    }
};

// Rutas del foro
router.get('/dashboard/trader-call/comunidad', isAuthenticated, hasTraderCallSubscription, forumController.getForumHome);
router.get('/dashboard/trader-call/forum/category/:categoryId', isAuthenticated, hasTraderCallSubscription, forumController.getCategory);
router.get('/dashboard/trader-call/forum/topic/:topicId', isAuthenticated, hasTraderCallSubscription, forumController.getTopic);

// Ruta para crear un nuevo tema - Aplicar los middlewares individualmente
router.post('/api/forum/create-topic', isAuthenticated, hasTraderCallSubscription, forumController.createTopic);

// Ruta para crear una nueva respuesta
router.post('/dashboard/trader-call/forum/reply', isAuthenticated, hasTraderCallSubscription, forumController.createReply);

// Ruta para buscar en el foro
router.get('/dashboard/trader-call/forum/search', isAuthenticated, hasTraderCallSubscription, forumController.searchForum);

// Ruta de prueba - Sin middlewares para simplificar
router.post('/test-forum-route', (req, res) => {
    console.log('Ruta de prueba accedida');
    console.log('Datos recibidos:', req.body);
    res.json({
        success: true,
        message: 'Ruta de prueba funcionando correctamente'
    });
});

module.exports = router; 