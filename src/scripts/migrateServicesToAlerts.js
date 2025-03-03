const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

const migrateData = async () => {
    try {
        // Obtener todos los usuarios
        const users = await User.find({});
        
        // Actualizar cada usuario
        for (const user of users) {
            if (user.membresias) {
                // Crear nuevos campos
                user.membresias.alertas = user.membresias.servicios || 'free';
                user.membresias.vencimientoAlertas = user.membresias.vencimientoServicios;
                
                // Guardar cambios
                await user.save();
                console.log(`Usuario ${user.email} actualizado correctamente`);
            }
        }
        
        console.log('Migración completada con éxito');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error durante la migración:', error);
        mongoose.disconnect();
    }
};

migrateData(); 