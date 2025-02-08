const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const User = require('../models/User');

// Middleware para verificar que el usuario es administrador
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.redirect('/');
    }
};

// Rutas del panel de administración
router.get('/dashboard', adminController.getDashboard);

// Ruta del panel admin
router.get('/', isAdmin, async (req, res) => {
    try {
        const users = await User.find({});
        const memberships = await User.find({ 'membership.status': 'active' });

        res.render('admin/dashboard', { 
            user: req.user,
            title: 'Panel de Administración',
            users,
            memberships
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', {
            message: 'Error al cargar el panel de administración',
            error: process.env.NODE_ENV === 'development' ? error : {},
            user: req.user
        });
    }
});

module.exports = router; 