const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Update = require('../models/Update');

// Middleware para verificar si es admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.redirect('/');
    }
};

// Ruta del panel admin
router.get('/', isAdmin, async (req, res) => {
    try {
        const users = await User.find({});
        const memberships = await User.find({ 'membership.status': 'active' });
        const updates = await Update.find({});
        
        res.render('admin/dashboard', { 
            user: req.user,
            title: 'Panel de Administración.',
            users,
            memberships,
            updates
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

// Ruta para ver actualizaciones
router.get('/updates', isAdmin, async (req, res) => {
    try {
        const updates = await Update.find().sort({ createdAt: -1 });
        res.render('admin/updates/index', {
            user: req.session.user,
            title: 'Gestión de Actualizaciones',
            updates,
            isAuthenticated: true
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', {
            message: 'Error al cargar actualizaciones',
            error: process.env.NODE_ENV === 'development' ? error : {},
            user: req.session.user,
            isAuthenticated: true
        });
    }
});

// Ruta para mostrar el formulario de nueva actualización
router.get('/updates/new', isAdmin, (req, res) => {
    res.render('admin/updates/new', {
        user: req.user,
        title: 'Nueva Actualización'
    });
});

// Ruta para ver usuarios
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find({});
        
        // Asegurarnos de que cada usuario tenga valores por defecto de membresías
        const processedUsers = users.map(user => {
            const userData = user.toObject();
            if (!userData.membresias) {
                userData.membresias = {
                    servicios: 'free',
                    entrenamientos: 'free',
                    asesoramiento: false
                };
            }
            return userData;
        });

        res.render('admin/users/index', { 
            users: processedUsers,
            user: req.user,
            isAuthenticated: true
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.render('error', { 
            message: 'Error al cargar usuarios',
            user: req.user,
            isAuthenticated: true
        });
    }
});

module.exports = router; 