const express = require('express');
const router = express.Router();
const Stats = require('../models/Stats');

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
        // Verificar si existen estadísticas
        const count = await Stats.countDocuments();
        
        // Si no hay estadísticas, inicializarlas
        if (count === 0) {
            await Stats.insertMany(initialStats);
            console.log('Estadísticas inicializadas automáticamente');
        }
        
        // Obtener estadísticas actualizadas de la base de datos
        const stats = await Stats.find().sort('order');
        
        res.render('landing', { 
            user: req.user,
            stats: stats
        });
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        res.render('landing', { 
            user: req.user,
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

module.exports = router; 