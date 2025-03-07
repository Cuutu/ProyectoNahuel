const express = require('express');
const router = express.Router();
const Stats = require('../models/Stats');
const traderCallDashboardRoutes = require('./traderCallDashboardRoutes');
const forumRoutes = require('./forumRoutes');

// Datos iniciales
const initialStats = [
    {
        value: '7 años',
        text: 'trabajando con el mercado',
        order: 1
    },
    {
        value: '+1500',
        text: 'alumnos',
        order: 2
    },
    {
        value: '+300',
        text: 'horas de formación',
        order: 3
    }
];

router.get('/', async (req, res) => {
    try {
        // Verificar si hay estadísticas, si no, inicializarlas
        const count = await Stats.countDocuments({ category: 'landing' });
        
        if (count === 0) {
            // Datos iniciales
            const initialStats = [
                {
                    value: '7 años',
                    text: 'trabajando con el mercado',
                    order: 1,
                    category: 'landing'
                },
                {
                    value: '+1500',
                    text: 'alumnos',
                    order: 2,
                    category: 'landing'
                },
                {
                    value: '+300',
                    text: 'horas de formación',
                    order: 3,
                    category: 'landing'
                }
            ];
            
            await Stats.insertMany(initialStats);
        }
        
        // Obtener estadísticas
        const stats = await Stats.find({ category: 'landing', visible: true }).sort('order');
        
        res.render('landing', {
            title: 'CryptoTrading',
            user: req.user || req.session.user,
            stats: stats
        });
    } catch (error) {
        console.error('Error al cargar la página principal:', error);
        res.render('landing', {
            title: 'CryptoTrading',
            user: req.user || req.session.user,
            stats: initialStats
        });
    }
});

router.get('/consultoria-financiera', (req, res) => {
    res.render('consultoria-financiera');
});

router.get('/cuenta-asesorada', (req, res) => {
    res.render('cuenta-asesorada');
});

router.use('/', traderCallDashboardRoutes);
router.use('/', forumRoutes);

module.exports = router; 