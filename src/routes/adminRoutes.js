const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const User = require('../models/User');
// Comentamos temporalmente el modelo Update hasta que esté completamente configurado
// const Update = require('../models/Update');
const multer = require('multer');
const upload = multer({ dest: 'src/public/uploads/' });

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
            memberships,
            // Temporalmente establecemos updates como array vacío
            updates: []
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

// Vista del formulario para crear actualización
router.get('/updates/new', isAdmin, (req, res) => {
    res.render('admin/updates/new', {
        user: req.user,
        title: 'Nueva Actualización'
    });
});

// Crear nueva actualización
router.post('/updates', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const update = new Update({
            title,
            content,
            imageUrl,
            author: req.user._id
        });

        await update.save();
        res.redirect('/admin/updates');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { message: 'Error al crear actualización' });
    }
});

// Lista de actualizaciones
router.get('/updates', isAdmin, async (req, res) => {
    try {
        const updates = await Update.find().sort({ createdAt: -1 });
        res.render('admin/updates/index', {
            user: req.user,
            updates,
            title: 'Actualizaciones'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { message: 'Error al cargar actualizaciones' });
    }
});

module.exports = router; 