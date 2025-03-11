const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const ForumTopic = require('../models/ForumTopic');
const ForumReply = require('../models/ForumReply');

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

// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
    const user = req.user || (req.session && req.session.user);
    if (user && user.role === 'admin') {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción'
    });
};

// Middleware para verificar si el usuario es el autor o administrador
const isAuthorOrAdmin = async (req, res, next) => {
    try {
        const user = req.user || (req.session && req.session.user);
        const { topicId, replyId } = req.params;
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Debes iniciar sesión para realizar esta acción'
            });
        }
        
        // Si es administrador, permitir
        if (user.role === 'admin') {
            return next();
        }
        
        // Verificar si es autor del tema o respuesta
        if (topicId) {
            const topic = await ForumTopic.findById(topicId);
            if (!topic) {
                return res.status(404).json({
                    success: false,
                    message: 'Tema no encontrado'
                });
            }
            
            if (topic.author.toString() === user._id.toString()) {
                return next();
            }
        }
        
        if (replyId) {
            const reply = await ForumReply.findById(replyId);
            if (!reply) {
                return res.status(404).json({
                    success: false,
                    message: 'Respuesta no encontrada'
                });
            }
            
            if (reply.author.toString() === user._id.toString()) {
                return next();
            }
        }
        
        return res.status(403).json({
            success: false,
            message: 'No tienes permisos para realizar esta acción'
        });
    } catch (error) {
        console.error('Error en middleware isAuthorOrAdmin:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al verificar permisos'
        });
    }
};

// Rutas del foro
router.get('/dashboard/trader-call/comunidad', isAuthenticated, hasTraderCallSubscription, forumController.getForumHome);
router.get('/dashboard/trader-call/forum/category/:categoryId', isAuthenticated, hasTraderCallSubscription, forumController.getCategory);
router.get('/dashboard/trader-call/forum/topic/:topicId', isAuthenticated, hasTraderCallSubscription, forumController.getTopic);

// Ruta para crear un nuevo tema - Aplicar los middlewares individualmente
router.post('/dashboard/trader-call/forum/topic', isAuthenticated, hasTraderCallSubscription, forumController.createTopic);

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

// Rutas para eliminar temas y respuestas
router.delete('/dashboard/trader-call/forum/topic/:topicId', isAuthenticated, hasTraderCallSubscription, isAuthorOrAdmin, forumController.deleteTopic);
router.delete('/dashboard/trader-call/forum/reply/:replyId', isAuthenticated, hasTraderCallSubscription, isAuthorOrAdmin, forumController.deleteReply);

// Ruta para crear una nueva categoría (solo administradores)
router.post('/api/forum/category', isAuthenticated, hasTraderCallSubscription, isAdmin, forumController.createCategory);

// Ruta de depuración para ver todos los temas (solo para desarrollo)
if (process.env.NODE_ENV === 'development') {
    router.get('/debug/forum/topics', isAuthenticated, async (req, res) => {
        try {
            const topics = await ForumTopic.find()
                .populate('author', 'nombre')
                .populate('category', 'name');
            
            res.json({
                success: true,
                count: topics.length,
                topics: topics.map(topic => ({
                    id: topic._id,
                    title: topic.title,
                    author: topic.author ? topic.author.nombre : 'N/A',
                    category: topic.category ? topic.category.name : 'N/A',
                    createdAt: topic.createdAt,
                    isActive: topic.isActive
                }))
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    });
}

module.exports = router; 