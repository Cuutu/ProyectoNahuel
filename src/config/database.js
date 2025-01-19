const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Agregar índices apropiados
        // Implementar caching
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB conectado: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error de conexión a MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB; 