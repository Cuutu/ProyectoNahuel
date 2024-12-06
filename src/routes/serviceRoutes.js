const express = require('express');
const router = express.Router();

// Ruta principal de servicios
router.get('/', (req, res) => {
    // Verificar y usar la sesión existente
    const userSession = req.session.user;
    
    res.render('services', {
        title: 'Nuestros Servicios',
        user: userSession
    });
});

router.get('/senales-premium', (req, res) => {
    const userSession = req.session.user;
    
    res.render('services/signals', {
        title: 'Señales Premium',
        user: userSession,
        service: {
            name: "Señales Premium",
            description: "Señales de trading en tiempo real con alta precisión",
            price: "99.99",
            features: [
                "Señales 24/7 en tiempo real",
                "Setup completo de entrada",
                "Stop Loss y Take Profit",
                "Análisis de mercado diario"
            ]
        }
    });
});

router.get('/mentoria-pro', (req, res) => {
    const userSession = req.session.user;
    
    res.render('services/mentoring', {
        title: 'Mentoría Pro',
        user: userSession,
        service: {
            name: "Mentoría Pro",
            description: "Mentoría personalizada para traders avanzados",
            price: "199.99",
            features: [
                "Mentoría 1:1",
                "Análisis de estrategias",
                "Revisión de operaciones",
                "Soporte 24/7"
            ]
        }
    });
});

router.get('/comunidad-vip', (req, res) => {
    const userSession = req.session.user;
    
    res.render('services/community', {
        title: 'Comunidad VIP',
        user: userSession,
        service: {
            name: "Comunidad VIP",
            description: "Comunidad de traders avanzados para intercambiar ideas",
            price: "49.99",
            features: [
                "Foro de discusión",
                "Talleres y seminarios",
                "Análisis de mercado",
                "Soporte de la comunidad"
            ]
        }
    });
});

module.exports = router; 