const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Update = require('../models/Update');
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');
const Mentoring = require('../models/mentoring');
const Stats = require('../models/Stats');
const TraderCallStats = require('../models/TraderCallStats');

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

// Ruta para ver todas las estadísticas
router.get('/stats', async (req, res) => {
    try {
        // Verificar si hay estadísticas de landing, si no, inicializarlas
        const landingCount = await Stats.countDocuments({ category: 'landing' });
        
        if (landingCount === 0) {
            // Datos iniciales para landing
            const initialLandingStats = [
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
            
            await Stats.insertMany(initialLandingStats);
            console.log('Estadísticas de landing inicializadas desde el panel de administración');
        }
        
        // Verificar si hay estadísticas de trader-call, si no, inicializarlas
        const traderCallCount = await Stats.countDocuments({ category: 'trader-call' });
        
        if (traderCallCount === 0) {
            // Datos iniciales para trader-call
            const initialTraderCallStats = [
                {
                    value: '85%',
                    text: '% de rendimiento del último año',
                    order: 1,
                    category: 'trader-call'
                },
                {
                    value: '+500',
                    text: 'Usuarios activos',
                    order: 2,
                    category: 'trader-call'
                },
                {
                    value: '+1300',
                    text: 'Alertas enviadas',
                    order: 3,
                    category: 'trader-call'
                },
                {
                    value: '24/7',
                    text: 'Soporte disponible',
                    order: 4,
                    category: 'trader-call'
                }
            ];
            
            await Stats.insertMany(initialTraderCallStats);
            console.log('Estadísticas de Trader Call inicializadas desde el panel de administración');
        }
        
        // Obtener todas las estadísticas
        const landingStats = await Stats.find({ category: 'landing' }).sort('order');
        const traderCallStats = await Stats.find({ category: 'trader-call' }).sort('order');
        
        res.render('admin/stats', { 
            landingStats,
            traderCallStats,
            title: 'Gestión de Estadísticas',
            user: req.user
        });
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        res.status(500).render('error', {
            message: 'Error al cargar estadísticas',
            user: req.user
        });
    }
});

// Ruta para actualizar estadísticas
router.post('/stats/update', async (req, res) => {
    try {
        const { id, value, text, visible, category } = req.body;
        
        // Verificar que los datos sean válidos
        if (!id || !value || !text) {
            return res.status(400).render('error', {
                message: 'Datos incompletos para actualizar estadísticas',
                user: req.user
            });
        }
        
        // Actualizar la estadística
        const updatedStat = await Stats.findByIdAndUpdate(
            id, 
            { 
                value, 
                text, 
                visible: visible === 'on', // Convertir checkbox a booleano
                category // Mantener la categoría
            },
            { new: true } // Para obtener el documento actualizado
        );
        
        if (!updatedStat) {
            return res.status(404).render('error', {
                message: 'Estadística no encontrada',
                user: req.user
            });
        }
        
        console.log('Estadística actualizada:', updatedStat);
        
        // Redireccionar a la página de estadísticas
        res.redirect('/admin/stats');
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error);
        res.status(500).render('error', {
            message: 'Error al actualizar estadísticas',
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
        
        // Calcular estadísticas
        const totalActivos = users.filter(user => 
            user.membresias?.servicios !== 'free' || 
            user.membresias?.entrenamientos !== 'free' ||
            user.membresias?.asesoramiento
        ).length;
        
        const totalServicios = users.filter(user => 
            user.membresias?.servicios && 
            user.membresias.servicios !== 'free'
        ).length;
        
        const totalEntrenamientos = users.filter(user => 
            user.membresias?.entrenamientos && 
            user.membresias.entrenamientos !== 'free'
        ).length;

        // Estadísticas de asesoramiento
        const stats = {
            asesoramiento: {
                activos: mentorings.filter(m => m.status === 'pending' || m.status === 'confirmed').length,
                total: mentorings.length
            }
        };

        res.render('admin/memberships', {
            users,
            mentorings,
            totalActivos,
            totalServicios,
            totalEntrenamientos,
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

// Ruta para ver estadísticas de Trader Call
router.get('/trader-call-stats', async (req, res) => {
    try {
        // Verificar si hay estadísticas, si no, inicializarlas
        const count = await TraderCallStats.countDocuments();
        
        if (count === 0) {
            // Datos iniciales basados en la vista actual
            const initialStats = [
                {
                    value: '85%',
                    label: '% de rendimiento del último año',
                    order: 1
                },
                {
                    value: '+500',
                    label: 'Usuarios activos',
                    order: 2
                },
                {
                    value: '+1300',
                    label: 'Alertas enviadas',
                    order: 3
                },
                {
                    value: '24/7',
                    label: 'Soporte disponible',
                    order: 4
                }
            ];
            
            await TraderCallStats.insertMany(initialStats);
            console.log('Estadísticas de Trader Call inicializadas desde el panel de administración');
        }
        
        const stats = await TraderCallStats.find().sort('order');
        
        res.render('admin/trader-call-stats', { 
            stats,
            title: 'Gestión de Estadísticas de Trader Call',
            user: req.user
        });
    } catch (error) {
        console.error('Error al cargar estadísticas de Trader Call:', error);
        res.status(500).render('error', {
            message: 'Error al cargar estadísticas de Trader Call',
            user: req.user
        });
    }
});

// Ruta para actualizar estadísticas de Trader Call
router.post('/trader-call-stats/update', async (req, res) => {
    try {
        const { id, value, label, visible } = req.body;
        
        // Verificar que los datos sean válidos
        if (!id || !value || !label) {
            return res.status(400).render('error', {
                message: 'Datos incompletos para actualizar estadísticas de Trader Call',
                user: req.user
            });
        }
        
        // Actualizar la estadística
        const updatedStat = await TraderCallStats.findByIdAndUpdate(
            id, 
            { 
                value, 
                label, 
                visible: visible === 'on' // Convertir checkbox a booleano
            },
            { new: true } // Para obtener el documento actualizado
        );
        
        if (!updatedStat) {
            return res.status(404).render('error', {
                message: 'Estadística de Trader Call no encontrada',
                user: req.user
            });
        }
        
        console.log('Estadística de Trader Call actualizada:', updatedStat);
        
        // Redireccionar a la página de estadísticas de Trader Call
        res.redirect('/admin/trader-call-stats');
    } catch (error) {
        console.error('Error al actualizar estadísticas de Trader Call:', error);
        res.status(500).render('error', {
            message: 'Error al actualizar estadísticas de Trader Call',
            user: req.user
        });
    }
});

module.exports = router; 