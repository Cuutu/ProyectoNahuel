const Signal = require('../models/Signal');
const User = require('../models/User');
const Update = require('../models/Update');

const adminController = {
    getDashboard: async (req, res) => {
        try {
            // Obtener estadísticas
            const signalsCount = await Signal.countDocuments({ estado: 'ACTIVA' });
            const premiumUsers = await User.countDocuments({ 
                'membership.status': 'active' 
            });
            const mentoringCount = await User.countDocuments({
                'membership.name': 'mentoring',
                'membership.status': 'active'
            });

            res.render('admin/dashboard', {
                stats: {
                    signalsCount,
                    premiumUsers,
                    mentoringCount
                }
            });
        } catch (error) {
            console.error('Error en dashboard admin:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar el dashboard' 
            });
        }
    },

    // Mostrar formulario de nueva actualización
    showUpdateForm: async (req, res) => {
        try {
            res.render('admin/updates/new', {
                title: 'Nueva alerta',
                user: req.user || req.session.user
            });
        } catch (error) {
            console.error('Error al mostrar formulario:', error);
            res.status(500).render('error', {
                message: 'Error al cargar el formulario'
            });
        }
    },

    // Crear nueva actualización
    createUpdate: async (req, res) => {
        try {
            const { tipo, titulo, descripcion, par, entrada, stopLoss, takeProfit, estado } = req.body;
            
            const updateData = {
                tipo,
                titulo,
                descripcion,
                estado: estado || 'ACTIVA',
                createdBy: req.user?._id || req.session?.user?._id
            };

            // Solo agregar campos de trading si no es tipo GENERAL
            if (tipo !== 'GENERAL') {
                Object.assign(updateData, {
                    par,
                    entrada: entrada ? parseFloat(entrada) : undefined,
                    stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
                    takeProfit: takeProfit ? parseFloat(takeProfit) : undefined
                });
            }

            const update = new Update(updateData);
            await update.save();
            
            res.redirect('/admin/updates');
        } catch (error) {
            console.error('Error al crear alerta:', error);
            res.status(500).render('error', {
                message: 'Error al crear la alerta',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    },

    // Listar actualizaciones
    listUpdates: async (req, res) => {
        try {
            const updates = await Update.find()
                .sort({ createdAt: -1 });
            
            res.render('admin/updates/index', {
                title: 'Alertas',
                updates,
                user: req.user || req.session.user
            });
        } catch (error) {
            console.error('Error al listar alerta:', error);
            res.status(500).render('error', {
                message: 'Error al cargar las alerta'
            });
        }
    },

    closeUpdate: async (req, res) => {
        try {
            const updateId = req.params.id;
            
            const update = await Update.findByIdAndUpdate(
                updateId,
                { estado: 'COMPLETADA' },
                { new: true }
            );

            if (!update) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Alerta no encontrada' 
                });
            }

            res.json({ 
                success: true, 
                message: 'Alerta cerrada exitosamente',
                update 
            });

        } catch (error) {
            console.error('Error al cerrar la alerta:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al cerrar la alerta' 
            });
        }
    },

    getMemberships: async (req, res) => {
        try {
            const users = await User.find({});
            
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

            res.render('admin/memberships', {
                users,
                totalActivos,
                totalServicios,
                totalEntrenamientos
            });
        } catch (error) {
            console.error('Error al obtener membresías:', error);
            res.status(500).render('error', { message: 'Error al cargar membresías' });
        }
    },
};

module.exports = adminController; 