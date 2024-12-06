const User = require('../models/User');
const bcrypt = require('bcryptjs');

const authController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user || !await bcrypt.compare(password, user.password)) {
                return res.render('auth/login', {
                    error: 'Credenciales inválidas'
                });
            }

            // Establecer la sesión
            req.session.user = {
                id: user._id,
                nombre: user.nombre,
                email: user.email
            };

            // Guardar la sesión explícitamente
            req.session.save((err) => {
                if (err) {
                    console.error('Error al guardar la sesión:', err);
                    return res.render('auth/login', {
                        error: 'Error al iniciar sesión'
                    });
                }
                res.redirect('/dashboard');
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.render('auth/login', {
                error: 'Error al iniciar sesión'
            });
        }
    },

    register: async (req, res) => {
        try {
            const { nombre, apellido, email, password, telefono } = req.body;
            
            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.render('auth/register', {
                    error: 'El email ya está registrado'
                });
            }

            // Hashear la contraseña
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

            req.session.user = {
                id: user._id,
                nombre: user.nombre,
                email: user.email
            };

            res.redirect('/dashboard');
        } catch (error) {
            console.error('Error en registro:', error);
            res.render('auth/register', {
                error: 'Error al registrar usuario'
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