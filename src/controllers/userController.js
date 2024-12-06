const User = require('../models/User');

const userController = {
    getDashboard: async (req, res) => {
        try {
            let userId;
            
            // Verificar si hay usuario autenticado (ya sea por passport o sesión)
            if (req.user) {
                userId = req.user._id;
            } else if (req.session && req.session.user) {
                userId = req.session.user.id;
            } else {
                return res.redirect('/auth/login');
            }

            const user = await User.findById(userId);
            
            if (!user) {
                req.session.destroy();
                return res.redirect('/auth/login');
            }

            res.render('user/dashboard', {
                user: user,
                title: 'Mi Perfil - Nahuel Lozano',
                isAuthenticated: true
            });
        } catch (error) {
            console.error('Error al cargar dashboard:', error);
            res.status(500).render('error', {
                message: 'Error al cargar el dashboard',
                user: req.user || req.session.user
            });
        }
    }
};

module.exports = userController; 