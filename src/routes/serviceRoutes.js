const express = require('express');
const router = express.Router();
const { sessionPersist } = require('../middleware/auth');
const Subscription = require('../models/Subscription');

// Aplicar middleware a todas las rutas de servicios
router.use(sessionPersist);

// Ruta principal de servicios
router.get('/', (req, res) => {
    res.render('services', {
        title: 'Nuestros Servicios',
        user: res.locals.user,
        isAuthenticated: res.locals.isAuthenticated
    });
});

router.get('/senales-premium', async (req, res) => {
    const userSession = req.session.user;
    
    if (!userSession) {
        return res.render('services/signals', {
            title: 'Trader Call',
            user: null,
            hasActiveSubscription: false,
            service: {
                name: "Trader Call",
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
    }

    // Verificar suscripción activa
    const activeSubscription = await Subscription.findOne({
        userId: userSession._id,
        serviceType: 'signals',
        status: 'active',
        endDate: { $gt: new Date() }
    });

    if (activeSubscription) {
        console.log('=== Suscripción Activa ===');
        console.log('Usuario:', userSession.email);
        console.log('Tipo:', activeSubscription.serviceType);
        console.log('Vence:', activeSubscription.endDate);
        console.log('========================');
    }

    res.render('services/signals', {
        title: 'Trader Call',
        user: userSession,
        hasActiveSubscription: !!activeSubscription,
        service: {
            name: "Trader Call",
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
        title: 'Smart Money',
        user: userSession,
        service: {
            name: "Smart Money",
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
        title: 'Dividend King',
        user: userSession,
        service: {
            name: "Dividend King",
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