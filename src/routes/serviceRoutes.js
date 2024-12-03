const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const servicesController = require('../controllers/servicesController');

// Ruta principal de servicios
router.get('/', servicesController.getServices);

// Rutas para servicios individuales
router.get('/senales-premium', (req, res) => {
    res.render('services/signals', {
        title: 'Señales Premium'
    });
});

router.get('/mentoria-pro', (req, res) => {
    res.render('services/mentoring', {
        title: 'Mentoría Pro'
    });
});

router.get('/comunidad-vip', (req, res) => {
    res.render('services/community', {
        title: 'Comunidad VIP'
    });
});

module.exports = router; 