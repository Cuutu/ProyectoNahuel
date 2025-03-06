const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Update = require('../models/Update');
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');
const Mentoring = require('../models/mentoring');
const Stats = require('../models/Stats');

// Middleware para verificar si es admin
const isAdminMiddleware = (req, res, next) => {
    try {
        // Verificar si el usuario está autenticado y es admin
        if ((req.user && req.user.isAdmin) || (req.session && req.session.user && req.session.user.isAdmin)) {
            console.log('Acceso autorizado al panel admin');
            next();
        } else {
            console.log('Acceso denegado al panel admin:', {
                user: req.user,
                sessionUser: req.session?.user
            });
            
            // Si el usuario está autenticado pero no es admin, mostrar un mensaje de error
            if ((req.user && !req.user.isAdmin) || (req.session && req.session.user && !req.session.user.isAdmin)) {
                return res.status(403).render('error', {
                    message: 'No tienes permisos para acceder al panel de administración',
                    user: req.user || req.session?.user
                });
            }
            
            // Si el usuario no está autenticado, redirigir al login
            res.redirect('/auth/login?returnTo=/admin');
        }
    } catch (error) {
        console.error('Error en middleware admin:', error);
        res.status(500).render('error', {
            message: 'Error al verificar permisos de administrador',
            user: req.user || req.session?.user
        });
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
        // Eliminar duplicados automáticamente cada vez que se carga la página
        await removeDuplicateStats();
        
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

// Ruta para limpiar estadísticas duplicadas
router.post('/stats/clean-duplicates', async (req, res) => {
    try {
        await removeDuplicateStats();
        
        // Redireccionar a la página de estadísticas con un parámetro para indicar que se limpiaron los duplicados
        res.redirect('/admin/stats?clean=true');
    } catch (error) {
        console.error('Error al limpiar estadísticas duplicadas:', error);
        res.status(500).render('error', {
            message: 'Error al limpiar estadísticas duplicadas',
            user: req.user
        });
    }
});

// Función para eliminar estadísticas duplicadas
async function removeDuplicateStats() {
    try {
        // Obtener todas las estadísticas agrupadas por categoría y orden
        const landingStats = await Stats.find({ category: 'landing' }).sort('order');
        const traderCallStats = await Stats.find({ category: 'trader-call' }).sort('order');
        
        // Mapa para rastrear órdenes únicos por categoría
        const uniqueOrders = {
            'landing': new Set(),
            'trader-call': new Set()
        };
        
        // IDs de estadísticas a mantener
        const keepIds = [];
        
        // Procesar estadísticas de landing
        for (const stat of landingStats) {
            if (!uniqueOrders['landing'].has(stat.order)) {
                uniqueOrders['landing'].add(stat.order);
                keepIds.push(stat._id);
            }
        }
        
        // Procesar estadísticas de trader-call
        for (const stat of traderCallStats) {
            if (!uniqueOrders['trader-call'].has(stat.order)) {
                uniqueOrders['trader-call'].add(stat.order);
                keepIds.push(stat._id);
            }
        }
        
        // Eliminar estadísticas duplicadas
        const result = await Stats.deleteMany({ 
            $or: [
                { category: 'landing', _id: { $nin: keepIds } },
                { category: 'trader-call', _id: { $nin: keepIds } }
            ]
        });
        
        if (result.deletedCount > 0) {
            console.log(`Se eliminaron ${result.deletedCount} estadísticas duplicadas`);
        }
    } catch (error) {
        console.error('Error al eliminar estadísticas duplicadas:', error);
    }
}

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
        
        // Obtener mentorías y manejar posibles errores de población
        let mentorings = [];
        try {
            mentorings = await Mentoring.find()
                .populate('userId', 'nombre apellido email')
                .sort({ date: 1 });
                
            // Filtrar mentorías con userId null para evitar errores
            mentorings = mentorings.map(mentoring => {
                // Si la población falló, asegurarse de que userId sea un objeto vacío en lugar de null
                if (!mentoring.userId) {
                    const mentoringObj = mentoring.toObject();
                    mentoringObj.userId = { 
                        nombre: 'Usuario', 
                        apellido: 'Desconocido', 
                        email: 'no-disponible' 
                    };
                    return mentoringObj;
                }
                return mentoring;
            });
        } catch (error) {
            console.error('Error al obtener mentorías:', error);
            mentorings = []; // Si hay un error, usar un array vacío
        }
        
        // Asegurarse de que cada usuario tenga la estructura de membresias
        const processedUsers = users.map(user => {
            const userData = user.toObject();
            if (!userData.membresias) {
                userData.membresias = {
                    alertas: 'free',
                    entrenamientos: 'free',
                    asesoramiento: false
                };
            }
            return userData;
        });
        
        // Calcular estadísticas
        const totalActivos = processedUsers.filter(user => 
            user.membresias?.alertas !== 'free' || 
            user.membresias?.entrenamientos !== 'free' ||
            user.membresias?.asesoramiento
        ).length;
        
        const totalServicios = processedUsers.filter(user => 
            user.membresias?.alertas && 
            user.membresias.alertas !== 'free'
        ).length;
        
        const totalEntrenamientos = processedUsers.filter(user => 
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
            users: processedUsers,
            mentorings,
            totalActivos,
            totalServicios,
            totalEntrenamientos,
            stats,
            title: 'Gestión de Membresías',
            user: req.user || req.session.user
        });
    } catch (error) {
        console.error('Error al cargar membresías:', error);
        res.status(500).render('error', { 
            message: 'Error al cargar la página: ' + error.message,
            user: req.user || req.session.user
        });
    }
});

// Ruta para actualizar membresía de usuario
router.post('/users/:id/update-membership', async (req, res) => {
    try {
        const userId = req.params.id;
        const { alertas, entrenamientos, asesoramiento, duracionMeses } = req.body;
        
        console.log('Actualizando membresía:', {
            userId,
            alertas,
            entrenamientos,
            asesoramiento,
            duracionMeses
        });
        
        // Calcular fechas de vencimiento
        const ahora = new Date();
        const vencimientoAlertas = alertas !== 'free' ? new Date(ahora.setMonth(ahora.getMonth() + parseInt(duracionMeses || 1))) : null;
        
        // Reiniciar la fecha para el siguiente cálculo
        ahora.setTime(new Date().getTime());
        const vencimientoEntrenamientos = entrenamientos !== 'free' ? new Date(ahora.setMonth(ahora.getMonth() + parseInt(duracionMeses || 1))) : null;
        
        // Reiniciar la fecha para el siguiente cálculo
        ahora.setTime(new Date().getTime());
        const vencimientoAsesoramiento = asesoramiento === 'true' ? new Date(ahora.setMonth(ahora.getMonth() + parseInt(duracionMeses || 1))) : null;
        
        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            console.error('Usuario no encontrado:', userId);
            return res.status(404).render('error', {
                message: 'Usuario no encontrado',
                user: req.user || req.session.user
            });
        }
        
        // Inicializar membresias si no existe
        if (!user.membresias) {
            user.membresias = {};
        }
        
        // Actualizar propiedades
        user.membresias.alertas = alertas;
        user.membresias.entrenamientos = entrenamientos;
        user.membresias.asesoramiento = asesoramiento === 'true';
        user.membresias.vencimientoAlertas = vencimientoAlertas;
        user.membresias.vencimientoEntrenamientos = vencimientoEntrenamientos;
        user.membresias.vencimientoAsesoramiento = vencimientoAsesoramiento;
        
        // Guardar cambios
        await user.save();
        
        console.log('Membresía actualizada correctamente:', {
            userId,
            membresias: user.membresias
        });
        
        // Redireccionar a la página de membresías
        res.redirect('/admin/memberships');
    } catch (error) {
        console.error('Error al actualizar membresía:', error);
        res.status(500).render('error', {
            message: 'Error al actualizar membresía: ' + error.message,
            user: req.user || req.session.user
        });
    }
});

// Ruta para crear nueva actualización
router.post('/updates', adminController.createUpdate);

// Ruta para cerrar actualización
router.put('/updates/:id/close', adminController.closeUpdate);

module.exports = router; 