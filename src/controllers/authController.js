const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');

exports.register = async (req, res, next) => {
    try {
        const { nombre, apellido, email, password, confirmPassword, telefono } = req.body;

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Las contraseñas no coinciden'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        // Validar formato de email
        if (!email.endsWith('@gmail.com')) {
            return res.status(400).json({
                success: false,
                message: 'Solo se permiten correos de @gmail.com'
            });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = await User.create({
            nombre,
            apellido,
            email,
            password: hashedPassword,
            telefono
        });

        // Crear roles iniciales
        await Role.create({
            userId: user._id,
            señales: null,
            mentoria: null,
            comunidad: null
        });

        // Redireccionar a login con mensaje de éxito
        res.redirect('/auth/login?registered=true');
    } catch (error) {
        next(error); // Pasar el error al manejador de errores
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Intento de login con email:', email);

        const user = await User.findOne({ email });
        console.log('Usuario encontrado:', user ? 'Sí' : 'No');

        if (!user) {
            return res.render('auth/login', {
                error: 'Email o contraseña incorrectos'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Contraseña correcta:', isMatch ? 'Sí' : 'No');

        if (!isMatch) {
            return res.render('auth/login', {
                error: 'Email o contraseña incorrectos'
            });
        }

        // Crear objeto de sesión
        const userSession = {
            id: user._id.toString(),
            nombre: user.nombre,
            email: user.email
        };

        console.log('Creando sesión con:', userSession);

        // Asignar a la sesión
        req.session.user = userSession;
        console.log('Sesión creada:', req.session);

        return res.redirect('/');

    } catch (error) {
        console.error('Error detallado en login:', error);
        return res.render('auth/login', {
            error: 'Error al iniciar sesión: ' + error.message
        });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}; 