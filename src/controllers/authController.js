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

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Crear sesión
        req.session.userId = user._id;
        res.redirect('/'); // Redirigir al home después del login
    } catch (error) {
        next(error);
    }
}; 