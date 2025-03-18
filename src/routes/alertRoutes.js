const express = require('express');
const router = express.Router();
const { sessionPersist } = require('../middleware/auth');
const Subscription = require('../models/Subscription');
const Stats = require('../models/Stats');

// Aplicar middleware a todas las rutas de alertas
router.use(sessionPersist);

// Ruta principal de alertas
router.get('/', async (req, res) => {
    try {
        res.render('alerts', {
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
    const userSession = req.user || req.session.user;
    
    // Verificar si el usuario está logueado y tiene una suscripción activa a Trader Call
    if (userSession && userSession.membresias && 
        (userSession.membresias.alertas === 'premium' || userSession.membresias.alertas === 'pro') && 
        userSession.membresias.vencimientoAlertas && new Date(userSession.membresias.vencimientoAlertas) > new Date()) {
        // Redirigir al dashboard de Trader Call
        return res.redirect('/dashboard/trader-call');
    }
    
    // Si no tiene suscripción activa, mostrar la página de ventas
    
    // Verificar suscripción activa si el usuario está logueado (código existente para compatibilidad)
    let hasActiveSubscription = false;
    if (userSession) {
        const activeSubscription = await Subscription.findOne({
            userId: userSession._id,
            serviceType: 'signals',
            status: 'active',
            endDate: { $gt: new Date() }
        });
        hasActiveSubscription = !!activeSubscription;
    }

    // Obtener estadísticas de Trader Call
    let traderCallStats = [];
    try {
        traderCallStats = await Stats.find({ category: 'trader-call', visible: true }).sort('order');
        
        // Si no hay estadísticas, inicializar con valores predeterminados
        if (traderCallStats.length === 0) {
            const initialStats = [
                {
                    value: '85%',
                    text: '% de rendimiento del último año.',
                    order: 1,
                    visible: true,
                    category: 'trader-call'
                },
                {
                    value: '+500',
                    text: 'Usuarios activos',
                    order: 2,
                    visible: true,
                    category: 'trader-call'
                },
                {
                    value: '+1300',
                    text: 'Alertas enviadas',
                    order: 3,
                    visible: true,
                    category: 'trader-call'
                },
                {
                    value: '24/7',
                    text: 'Soporte disponible',
                    order: 4,
                    visible: true,
                    category: 'trader-call'
                }
            ];
            
            await Stats.insertMany(initialStats);
            traderCallStats = await Stats.find({ category: 'trader-call', visible: true }).sort('order');
        }
    } catch (error) {
        console.error('Error al obtener estadísticas de Trader Call:', error);
        // Continuar con estadísticas vacías si hay error
    }

    // Renderizar la vista específica de Trader Call
    res.render('alerts/trader-call', {
        title: 'Trader Call - Alertas de Trading',
        user: userSession,
        hasActiveSubscription: hasActiveSubscription,
        traderCallStats: traderCallStats,
        service: {
            name: "Trader Call",
            description: "Señales de trading en tiempo real con alta precisión",
            price: "99.99",
            features: [
                "Señales 24/7 en tiempo real",
                "Setup completo de entrada",
                "Stop Loss y Take Profit",
                "Análisis de mercado diario",
                "Acceso a canal privado de Telegram",
                "Informes detallados post-mercado",
                "Alertas de oportunidades especiales"
            ]
        }
    });
});

router.get('/smart-money', (req, res) => {
    const userSession = req.session.user;
    res.render('alertas/smart-money', {
        user: userSession,
        traderCallStats: null // Esto permitirá que se usen las estadísticas por defecto
    });
});

router.get('/cashflow', (req, res) => {
    const userSession = req.session.user;
    res.render('alerts/community', {
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