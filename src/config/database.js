const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Intentando conectar a MongoDB...');
        console.log('URI:', process.env.MONGODB_URI.replace(/:([^:@]{1,})@/, ':****@')); // Oculta la contraseña en los logs

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log(`MongoDB conectado: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('Error detallado de conexión a MongoDB:', error);
        process.exit(1); // Detiene la aplicación si no puede conectar a la DB
    }
};

module.exports = connectDB; 