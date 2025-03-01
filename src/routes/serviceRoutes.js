const express = require('express');
const router = express.Router();
const { sessionPersist } = require('../middleware/auth');
const Subscription = require('../models/Subscription');

// Aplicar middleware a todas las rutas de servicios
router.use(sessionPersist);

// Ruta principal de servicios
router.get('/', async (req, res) => {
    try {
        res.render('services', {
            title: "Nuestras Alertas",
            user: req.user || req.session.user,
            isAuthenticated: req.isAuthenticated() || !!req.session.user,
            description: "Descubre nuestras alertas premium de trading",
            stats: {
                signals: {
                    count: 1500,
                    label: 'Traders Activos',
                    description: 'en Trader Call',
                    icon: '👥'
                },
                mentoring: {
                    count: 500,
                    label: 'Alumnos',
                    description: 'en Smart Money',
                    icon: '👨‍🏫'
                },
                community: {
                    count: 2500,
                    label: 'Miembros VIP',
                    description: 'en CashFlow',
                    icon: '🌟'
                }
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { 
            message: 'Error al cargar la página',
            user: req.user || req.session.user
        });
    }
});

router.get('/trader-call', async (req, res) => {
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

router.get('/smart-money', (req, res) => {
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

router.get('/cashflow', (req, res) => {
    const userSession = req.session.user;
    res.render('services/community', {
        title: 'CashFlow',
        user: userSession,
        service: {
            name: "CashFlow",
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