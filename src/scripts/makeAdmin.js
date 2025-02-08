const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function makeAdmin() {
    try {
        // Conectar a la base de datos
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');

        // Actualizar el usuario (reemplaza con el email que quieras hacer admin)
        const result = await User.findOneAndUpdate(
            { email: "tu-email@gmail.com" }, // Reemplaza con tu email
            { isAdmin: true },
            { new: true }
        );

        if (result) {
            console.log('Usuario actualizado exitosamente:', result.email);
        } else {
            console.log('Usuario no encontrado');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Desconectado de MongoDB');
    }
}

makeAdmin(); 