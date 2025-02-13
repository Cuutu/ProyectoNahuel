const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Update = require('../models/Update');
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');
const Mentoring = require('../models/mentoring');

// Middleware para verificar si es admin
const isAdminMiddleware = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.redirect('/');
    }
};

// Aplicar middleware de admin a todas las rutas
router.use(isAdminMiddleware);

// Middleware de debug
router.use((req, res, next) => {
    console.log('Ruta admin accedida:', {
        path: req.path,
        method: req.method,
        user: req.user,
        session: req.session
    });
    next();
});

// Ruta del panel admin
router.get('/', async (req, res) => {
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

// Ruta de prueba
router.get('/test', (req, res) => {
    res.send('Ruta admin de prueba funcionando');
});

// Ruta para ver actualizaciones
router.get('/updates', adminController.listUpdates);

// Ruta para mostrar el formulario de nueva actualización
router.get('/updates/new', adminController.showUpdateForm);

// Ruta para ver usuarios
router.get('/users', async (req, res) => {
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

// Ruta para ver membresías
router.get('/memberships', async (req, res) => {
    try {
        const users = await User.find({});
        const mentorings = await Mentoring.find()
            .populate('userId', 'nombre apellido email')
            .sort({ date: 1 });
        
        // Función auxiliar para verificar si una membresía está activa (no es free)
        const isMembresiaActiva = (user) => {
            return (user.membresias?.servicios && user.membresias.servicios !== 'free') || 
                   (user.membresias?.entrenamientos && user.membresias.entrenamientos !== 'free') || 
                   user.membresias?.asesoramiento === true;
        };

        // Estadísticas de membresías y mentorías
        const stats = {
            // Servicios
            servicios: {
                basic: users.filter(u => u.membresias?.servicios === 'basic').length,
                premium: users.filter(u => u.membresias?.servicios === 'premium').length,
                pro: users.filter(u => u.membresias?.servicios === 'pro').length,
                total: users.filter(u => u.membresias?.servicios && u.membresias.servicios !== 'free').length,
                proximos_vencer: users.filter(u => {
                    if (!u.membresias?.vencimientoServicios || u.membresias.servicios === 'free') return false;
                    const diasRestantes = Math.ceil((new Date(u.membresias.vencimientoServicios) - new Date()) / (1000 * 60 * 60 * 24));
                    return diasRestantes <= 7 && diasRestantes > 0;
                })
            },
            // Entrenamientos
            entrenamientos: {
                basic: users.filter(u => u.membresias?.entrenamientos === 'basic').length,
                premium: users.filter(u => u.membresias?.entrenamientos === 'premium').length,
                pro: users.filter(u => u.membresias?.entrenamientos === 'pro').length,
                total: users.filter(u => u.membresias?.entrenamientos && u.membresias.entrenamientos !== 'free').length,
                proximos_vencer: users.filter(u => {
                    if (!u.membresias?.vencimientoEntrenamientos || u.membresias.entrenamientos === 'free') return false;
                    const diasRestantes = Math.ceil((new Date(u.membresias.vencimientoEntrenamientos) - new Date()) / (1000 * 60 * 60 * 24));
                    return diasRestantes <= 7 && diasRestantes > 0;
                })
            },
            // Asesoramiento
            asesoramiento: {
                activos: mentorings.filter(m => m.status === 'pending' || m.status === 'confirmed').length,
                completados: mentorings.filter(m => m.status === 'completed').length,
                cancelados: mentorings.filter(m => m.status === 'cancelled').length,
                total: mentorings.length
            },
            // Total de usuarios con alguna membresía paga activa
            total_activos: users.filter(isMembresiaActiva).length
        };

        // Filtrar solo usuarios con membresías pagas
        const usuariosActivos = users.filter(isMembresiaActiva);

        res.render('admin/memberships', {
            users: usuariosActivos,
            mentorings,
            stats,
            title: 'Gestión de Membresías',
            user: req.user
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { 
            message: 'Error al cargar la página',
            user: req.user
        });
    }
});

// Ruta para crear nueva actualización
router.post('/updates', adminController.createUpdate);

// Ruta para cerrar actualización
router.put('/updates/:id/close', adminController.closeUpdate);

module.exports = router; 