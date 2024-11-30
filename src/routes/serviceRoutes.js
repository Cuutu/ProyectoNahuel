const express = require('express');
const router = express.Router();

// Rutas existentes
router.get('/servicios', (req, res) => {
    res.render('services', {
        title: "Nuestros Servicios"
    });
});

// Nuevas rutas para servicios individuales
router.get('/servicios/senales-premium', (req, res) => {
    res.render('services/signals', {
        title: "Señales Premium",
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

router.get('/servicios/mentoria-pro', (req, res) => {
    res.render('services/mentoring', {
        title: "Mentoría PRO",
        service: {
            name: "Mentoría PRO",
            description: "Formación personalizada con traders expertos",
            price: "299.99",
            features: [
                "Sesiones personalizadas",
                "Plan de trading individual",
                "Revisión de operaciones",
                "Soporte prioritario 24/7"
            ]
        }
    });
});

router.get('/servicios/comunidad-vip', (req, res) => {
    res.render('services/community', {
        title: "Comunidad VIP",
        service: {
            name: "Comunidad VIP",
            description: "Acceso exclusivo a nuestra comunidad de traders",
            price: "49.99",
            features: [
                "Chat grupal en tiempo real",
                "Webinars semanales",
                "Biblioteca de recursos",
                "Eventos exclusivos"
            ]
        }
    });
});

module.exports = router; 