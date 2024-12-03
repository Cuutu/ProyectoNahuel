const User = require('../models/User');
const bcrypt = require('bcryptjs');

const authController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Buscar usuario
            const user = await User.findOne({ email });
            if (!user) {
                return res.render('auth/login', {
                    error: 'Usuario no encontrado'
                });
            }

            // Verificar contraseña
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.render('auth/login', {
                    error: 'Contraseña incorrecta'
                });
            }

            // Crear sesión
            req.session.user = {
                id: user._id,
                email: user.email,
                nombre: user.nombre,
                apellido: user.apellido
            };

            // Guardar sesión explícitamente
            req.session.save((err) => {
                if (err) {
                    console.error('Error al guardar la sesión:', err);
                    return res.render('auth/login', {
                        error: 'Error al iniciar sesión'
                    });
                }
                res.redirect('/user/dashboard');
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.render('auth/login', {
                error: 'Error al iniciar sesión'
            });
        }
    },

    logout: async (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
                return res.redirect('/');
            }
            res.clearCookie('connect.sid'); // Limpiar la cookie de sesión
            res.redirect('/');
        });
    }
};

module.exports = authController; 