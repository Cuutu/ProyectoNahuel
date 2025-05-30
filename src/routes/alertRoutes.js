const express = require('express');
const router = express.Router();
const { sessionPersist } = require('../middleware/auth');
const Subscription = require('../models/Subscription');
const Stats = require('../models/Stats');
const SmartMoneyStats = require('../models/SmartMoneyStats');
const isAdmin = require('../middleware/admin');

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

router.get('/smart-money', async (req, res) => {
    const userSession = req.user || req.session.user;
    
    // Verificar si el usuario está logueado y tiene una suscripción activa a Smart Money
    if (userSession && userSession.membresias && 
        userSession.membresias.alertas === 'pro' && 
        userSession.membresias.vencimientoAlertas && new Date(userSession.membresias.vencimientoAlertas) > new Date()) {
        // Redirigir al dashboard de Smart Money
        return res.redirect('/dashboard/smart-money');
    }
    
    try {
        // Buscar las estadísticas de Smart Money
        const smartMoneyStats = await Stats.find({ 
            category: 'smart-money',
            visible: true 
        }).sort('order');
        
        res.render('alertas/smart-money', {
            title: 'Smart Money - Mentoría Personalizada',
            user: userSession,
            smartMoneyStats,
            subscription: req.query.subscription
        });
    } catch (error) {
        console.error('Error:', error);
        res.render('alertas/smart-money', {
            title: 'Smart Money - Mentoría Personalizada',
            user: userSession,
            smartMoneyStats: []
        });
    }
});

router.get('/cashflow', async (req, res) => {
    const userSession = req.user || req.session.user;
    
    // Verificar si el usuario está logueado y tiene una suscripción activa a Cash Flow
    if (userSession && userSession.membresias && 
        userSession.membresias.alertas === 'premium' && 
        userSession.membresias.vencimientoAlertas && new Date(userSession.membresias.vencimientoAlertas) > new Date()) {
        // Redirigir al dashboard de Cash Flow
        return res.redirect('/dashboard/cashflow');
    }
    
    try {
        // Buscar las estadísticas de Cash Flow
        const cashflowStats = await Stats.find({ 
            category: 'cashflow',
            visible: true 
        }).sort('order');
        
        res.render('cashflow/index', {
            title: 'CashFlow - Comunidad de Trading',
            user: userSession,
            isAuthenticated: req.isAuthenticated() || !!req.session.user,
            activePage: 'cashflow',
            cashflowStats,
            subscription: req.query.subscription
        });
    } catch (error) {
        console.error('Error:', error);
        res.render('cashflow/index', {
            title: 'CashFlow - Comunidad de Trading',
            user: userSession,
            isAuthenticated: req.isAuthenticated() || !!req.session.user,
            activePage: 'cashflow',
            cashflowStats: []
        });
    }
});

// Rutas de administración para Smart Money Stats
router.get('/admin/smart-money-stats', isAdmin, async (req, res) => {
    try {
        const stats = await SmartMoneyStats.find().sort('order');
        res.render('admin/smart-money-stats', { 
            stats,
            user: req.user
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', {
            message: 'Error al cargar las estadísticas',
            user: req.user
        });
    }
});

// CRUD para estadísticas
router.post('/admin/smart-money-stats/create', isAdmin, async (req, res) => {
    try {
        const { value, label, visible } = req.body;
        const newStat = new SmartMoneyStats({ value, label, visible });
        await newStat.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Error al crear la estadística' });
    }
});

router.post('/admin/smart-money-stats/update', isAdmin, async (req, res) => {
    try {
        const { id, value, label, visible } = req.body;
        await SmartMoneyStats.findByIdAndUpdate(id, { value, label, visible });
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Error al actualizar la estadística' });
    }
});

router.post('/admin/smart-money-stats/toggle-visibility', isAdmin, async (req, res) => {
    try {
        const { id, visible } = req.body;
        await SmartMoneyStats.findByIdAndUpdate(id, { visible });
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Error al cambiar la visibilidad' });
    }
});

router.post('/admin/smart-money-stats/delete', isAdmin, async (req, res) => {
    try {
        const { id } = req.body;
        await SmartMoneyStats.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Error al eliminar la estadística' });
    }
});

module.exports = router; 