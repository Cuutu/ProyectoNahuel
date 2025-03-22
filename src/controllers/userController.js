const User = require('../models/User');

const userController = {
    getDashboard: async (req, res) => {
        try {
            // Obtener el usuario con sus membresías
            const user = await User.findById(req.user._id);
            
            // Verificar si el usuario tiene membresías
            if (!user.membresias) {
                user.membresias = {
                    alertas: 'free',
                    entrenamientos: 'free',
                    asesoramiento: false
                };
            }

            console.log('Membresías del usuario:', user.membresias); // Para debug

            res.render('dashboard/index', {
                user: user,
                title: 'Mi Perfil'
            });
        } catch (error) {
            console.error('Error al cargar el dashboard:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar el perfil'
            });
        }
    }
};

module.exports = userController; 