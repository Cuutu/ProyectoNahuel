const User = require('../models/User');
const bcrypt = require('bcryptjs');

const authController = {
    register: async (req, res) => {
        try {
            const { nombre, apellido, email, password, confirmPassword, telefono } = req.body;

            // Verificar si las contraseñas coinciden
            if (password !== confirmPassword) {
                return res.render('auth/register', {
                    error: 'Las contraseñas no coinciden'
                });
            }

            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.render('auth/register', {
                    error: 'El email ya está registrado'
                });
            }

            // Hash de la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Crear nuevo usuario
            const user = await User.create({
                nombre,
                apellido,
                email,
                password: hashedPassword,
                telefono
            });

            // Crear sesión
            req.session.user = {
                id: user._id,
                email: user.email,
                nombre: user.nombre,
                apellido: user.apellido
            };

            // Guardar sesión
            req.session.save((err) => {
                if (err) {
                    console.error('Error al guardar la sesión:', err);
                    return res.render('auth/register', {
                        error: 'Error al registrar usuario'
                    });
                }
                res.redirect('/user/dashboard');
            });

        } catch (error) {
            console.error('Error en registro:', error);
            res.render('auth/register', {
                error: 'Error al registrar usuario'
            });
        }
    },

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