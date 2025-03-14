const express = require('express');
const router = express.Router();

// Middleware de autenticación y verificación de suscripción
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() || (req.session && req.session.user)) {
        return next();
    }
    res.redirect('/auth/login');
};

// Middleware para verificar si el usuario tiene una suscripción activa a Trader Call
const hasTraderCallSubscription = (req, res, next) => {
    const user = req.user || (req.session && req.session.user);
    
    // Verificar si el usuario tiene una suscripción activa a Trader Call
    // Comprobar según el modelo de usuario
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

// Ruta principal del dashboard de Trader Call
router.get('/dashboard/trader-call', (req, res) => {
    const user = req.user || req.session.user;
    
    res.render('dashboard/trader-call/index', {
        user: user,
        title: 'Dashboard Trader Call - Nahuel Lozano',
        isAuthenticated: true,
        currentPath: req.path
    });
});

// Ruta para el seguimiento de alertas
router.get('/dashboard/trader-call/seguimiento', (req, res) => {
    const user = req.user || req.session.user;
    
    res.render('dashboard/trader-call/seguimiento', {
        user: user,
        title: 'Seguimiento de Alertas - Trader Call',
        isAuthenticated: true,
        currentPath: req.path
    });
});

// Ruta para las alertas vigentes
router.get('/dashboard/trader-call/alertas-vigentes', (req, res) => {
    const user = req.user || req.session.user;
    
    res.render('dashboard/trader-call/alertas-vigentes', {
        user: user,
        title: 'Alertas Vigentes - Trader Call',
        isAuthenticated: true,
        currentPath: req.path
    });
});

// Añadir estas rutas para la gestión de informes
const informeController = require('../controllers/informeController');

// Rutas para los informes
router.get('/dashboard/trader-call/informes', informeController.getInformes);
router.get('/dashboard/trader-call/informes/crear', isAdmin, informeController.mostrarFormularioCrear);
router.post('/dashboard/trader-call/informes/crear', isAdmin, informeController.crearInforme);
router.get('/dashboard/trader-call/informes/:id', async (req, res) => {
    try {
        const informe = await Informe.findById(req.params.id);
        if (!informe) {
            return res.redirect('/dashboard/trader-call/informes');
        }
        
        res.render('dashboard/trader-call/detalle-informe', {
            user: req.user,
            currentPath: req.path,
            title: informe.titulo,
            informe
        });
    } catch (error) {
        console.error('Error al obtener informe:', error);
        res.redirect('/dashboard/trader-call/informes');
    }
});
router.get('/dashboard/trader-call/informes/eliminar/:id', isAdmin, informeController.eliminarInforme);

// Middleware para verificar si el usuario es administrador
function isAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    res.redirect('/dashboard/trader-call/informes');
}

// Ruta para la comunidad
router.get('/dashboard/trader-call/comunidad', (req, res) => {
    const user = req.user || req.session.user;
    
    // Modificar para incluir las categorías del foro
    const ForumCategory = require('../models/ForumCategory');
    
    // Obtener las categorías del foro
    ForumCategory.find({ isActive: true }).sort('order')
        .then(categories => {
            res.render('dashboard/trader-call/comunidad', {
                user: user,
                title: 'Comunidad - Trader Call',
                isAuthenticated: true,
                categories: categories || [] // Pasar las categorías a la vista
            });
        })
        .catch(error => {
            console.error('Error al obtener categorías del foro:', error);
            res.render('dashboard/trader-call/comunidad', {
                user: user,
                title: 'Comunidad - Trader Call',
                isAuthenticated: true,
                categories: [] // Pasar un array vacío en caso de error
            });
        });
});

// Añadir estas rutas para servir archivos multimedia
router.get('/dashboard/trader-call/informes/imagen/:id', informeController.getImagen);
router.get('/dashboard/trader-call/informes/video/:id', informeController.getVideo);

module.exports = router; 