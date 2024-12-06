const User = require('../models/User');

const userController = {
    getDashboard: async (req, res) => {
        try {
            // Verificar si hay usuario autenticado
            if (!req.session || !req.session.user) {
                return res.redirect('/auth/login');
            }

            const user = await User.findById(req.session.user.id);
            
            if (!user) {
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
            res.status(500).render('error', {
                message: 'Error al cargar el dashboard',
                user: req.session.user
            });
        }
    }
};

module.exports = userController; 