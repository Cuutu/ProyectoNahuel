const User = require('../models/User');

const testController = {
    testDB: async (req, res) => {
        try {
            // Intentar crear un usuario de prueba
            const testUser = await User.create({
                nombre: "Test",
                apellido: "Usuario",
                email: "test@gmail.com",
                password: "test123",
                telefono: "1234567890"
            });

            // Intentar obtener todos los usuarios
            const users = await User.find();

            res.json({
                message: "Conexión exitosa",
                testUser,
                totalUsers: users.length,
                users
            });

        } catch (error) {
            console.error('Error en prueba:', error);
            res.status(500).json({
                message: "Error en la prueba de base de datos",
                error: error.message
            });
        }
    }
};

module.exports = testController; 