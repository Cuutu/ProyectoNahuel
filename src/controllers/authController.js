const User = require('../models/User');
const bcrypt = require('bcryptjs');

const authController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.render('auth/login', {
                    error: 'Usuario no encontrado',
                    returnTo: req.query.returnTo || '/user/dashboard'
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.render('auth/login', {
                    error: 'Contraseña incorrecta',
                    returnTo: req.query.returnTo || '/user/dashboard'
                });
            }

            req.session.user = {
                id: user._id,
                nombre: user.nombre,
                email: user.email
            };

            // Redirigir a la URL original si existe, o al dashboard por defecto
            const returnTo = req.query.returnTo || '/user/dashboard';
            res.redirect(returnTo);
        } catch (error) {
            console.error('Error en login:', error);
            res.render('auth/login', {
                error: 'Error al iniciar sesión',
                returnTo: req.query.returnTo || '/user/dashboard'
            });
        }
    },

    register: async (req, res) => {
        try {
            const { nombre, email, password } = req.body;
            
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.render('auth/register', {
                    error: 'El email ya está registrado',
                    returnTo: req.query.returnTo || '/user/dashboard'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                nombre,
                email,
                password: hashedPassword
            });

            await user.save();

            req.session.user = {
                id: user._id,
                nombre: user.nombre,
                email: user.email
            };

            // Redirigir a la URL original si existe, o al dashboard por defecto
            const returnTo = req.query.returnTo || '/user/dashboard';
            res.redirect(returnTo);
        } catch (error) {
            console.error('Error en registro:', error);
            res.render('auth/register', {
                error: 'Error al registrar usuario',
                returnTo: req.query.returnTo || '/user/dashboard'
            });
        }
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
            }
            res.redirect('/');
        });
    }
};

module.exports = authController; 