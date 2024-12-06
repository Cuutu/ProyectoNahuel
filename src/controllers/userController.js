const User = require('../models/User');

const userController = {
    getDashboard: async (req, res) => {
        try {
            // Verificar si hay usuario autenticado
            const userId = req.user?._id || req.session?.user?.id;
            
            if (!userId) {
                return res.redirect('/auth/login');
            }

            const user = await User.findById(userId);
            
            if (!user) {
                // Si no se encuentra el usuario, limpiar la sesión
                req.session.destroy();
                return res.redirect('/auth/login');
            }

            res.render('user/dashboard', {
                user: user,
                title: 'Mi Perfil - CryptoTrading',
                isAuthenticated: true
            });
        } catch (error) {
            console.error('Error al cargar dashboard:', error);
            res.render('error', {
                message: 'Error al cargar el perfil',
                user: req.user || req.session.user
            });
        }
    }
};

module.exports = userController; 