const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { isAuthenticated } = require('../middleware/auth');

// Middleware para verificar si el usuario tiene una suscripción activa a Trader Call
const hasTraderCallSubscription = (req, res, next) => {
    const user = req.user || (req.session && req.session.user);
    
    // Verificar si el usuario tiene una suscripción activa a Trader Call
    if (user && user.membresias && 
        (user.membresias.alertas === 'premium' || user.membresias.alertas === 'pro') && 
        user.membresias.vencimientoAlertas && new Date(user.membresias.vencimientoAlertas) > new Date()) {
        return next();
    }
    
    // Si no tiene suscripción, redirigir a la página de suscripción
    res.redirect('/alertas/trader-call?subscription=required');
};

// Aplicar middleware a todas las rutas
router.use(isAuthenticated);
router.use(hasTraderCallSubscription);

// Rutas del foro
router.get('/dashboard/trader-call/comunidad', forumController.getForumHome);
router.get('/dashboard/trader-call/forum/category/:categoryId', forumController.getCategory);
router.get('/dashboard/trader-call/forum/topic/:topicId', forumController.getTopic);
router.post('/dashboard/trader-call/forum/topic', forumController.createTopic);
router.post('/dashboard/trader-call/forum/reply', forumController.createReply);
router.get('/dashboard/trader-call/forum/search', forumController.searchForum);

module.exports = router; 