const mongoose = require('mongoose');
const User = require('../models/User');

async function makeAdmin() {
    try {
        // URL de conexión actualizada
        const MONGODB_URI = "mongodb+srv://Tortu:asdasd123@proyectonahuel.jgjgs.mongodb.net/?retryWrites=true&w=majority&appName=ProyectoNahuel";
        
        await mongoose.connect(MONGODB_URI);
        console.log('Conectado a MongoDB');

        const result = await User.findOneAndUpdate(
            { email: "franco.l.varela99@gmail.com" }, // Reemplaza con el email que quieres hacer admin
            { 
                isAdmin: true,
                role: "admin"
            },
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