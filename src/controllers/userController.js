const User = require('../models/User');

const userController = {
    getDashboard: async (req, res) => {
        try {
            const user = await User.findById(req.session.user.id);
            
            if (!user) {
                return res.redirect('/auth/login');
            }

            res.render('user/dashboard', {
                user: user,
                title: 'Mi Perfil - CryptoTrading'
            });
        } catch (error) {
            console.error('Error al cargar dashboard:', error);
            res.render('error', {
                message: 'Error al cargar el perfil'
            });
        }
    }
};

module.exports = userController; 