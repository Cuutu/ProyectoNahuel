const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
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

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Crear sesión
    req.session.userId = user._id;
    res.json({ message: 'Login exitoso' });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}; 