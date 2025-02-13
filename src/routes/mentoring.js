const express = require('express');
const router = express.Router();
const Mentoring = require('../models/mentoring');

// Middleware para verificar autenticación
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
    });
};

router.post('/api/mentoring/book', isAuthenticated, async (req, res) => {
    try {
        const mentoring = new Mentoring({
            userId: req.session.user._id,
            date: new Date(req.body.date),
            duration: '1 hora',
            price: 99.99,
            status: 'pending'
        });

        await mentoring.save();
        
        res.status(201).json({
            success: true,
            mentoring: mentoring
        });
    } catch (error) {
        console.error('Error al crear mentoría:', error);
        res.status(500).json({
            success: false,
            error: 'Error al procesar la reserva'
        });
    }
});

module.exports = router; 