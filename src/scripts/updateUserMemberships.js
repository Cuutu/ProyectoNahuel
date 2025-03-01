const mongoose = require('mongoose');
const User = require('../models/User');

async function updateUsers() {
    try {
        // Actualizar todos los usuarios que no tienen membresias
        await User.updateMany(
            { membresias: { $exists: false } },
            {
                $set: {
                    membresias: {
                        servicios: 'free',
                        entrenamientos: 'free',
                        asesoramiento: false
                    }
                }
            }
        );
        
        console.log('Usuarios actualizados exitosamente');
    } catch (error) {
        console.error('Error al actualizar usuarios:', error);
    } finally {
        mongoose.disconnect();
    }
}

// Conectar a la base de datos y ejecutar la actualización
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Conectado a MongoDB');
        return updateUsers();
    })
    .catch(console.error); 