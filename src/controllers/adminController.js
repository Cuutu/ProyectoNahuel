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
            console.log('Intentando mostrar formulario');
            res.send('Formulario de actualización');
        } catch (error) {
            console.error('Error en showUpdateForm:', error);
            next(error);
        }
    },

    // Crear nueva actualización
    createUpdate: async (req, res) => {
        try {
            const { tipo, titulo, descripcion, par, entrada, stopLoss, takeProfit } = req.body;
            
            const update = new Update({
                tipo,
                titulo,
                descripcion,
                par,
                entrada,
                stopLoss,
                takeProfit,
                createdBy: req.user._id
            });

            await update.save();
            
            res.redirect('/admin/updates');
        } catch (error) {
            console.error('Error al crear actualización:', error);
            res.status(500).render('error', {
                message: 'Error al crear la actualización',
                error: error
            });
        }
    },

    // Listar actualizaciones
    listUpdates: async (req, res) => {
        try {
            console.log('Intentando listar actualizaciones');
            res.send('Lista de actualizaciones');
        } catch (error) {
            console.error('Error en listUpdates:', error);
            next(error);
        }
    }
};

module.exports = adminController; 