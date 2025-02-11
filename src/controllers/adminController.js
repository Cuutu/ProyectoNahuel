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
                title: 'Nueva Actualización',
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
            console.error('Error al crear actualización:', error);
            res.status(500).render('error', {
                message: 'Error al crear la actualización',
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
                title: 'Actualizaciones',
                updates,
                user: req.user || req.session.user
            });
        } catch (error) {
            console.error('Error al listar actualizaciones:', error);
            res.status(500).render('error', {
                message: 'Error al cargar las actualizaciones'
            });
        }
    }
};

module.exports = adminController; 