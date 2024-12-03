const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout después de 5 segundos
            socketTimeoutMS: 45000, // Close sockets después de 45 segundos de inactividad
        });
        
        console.log(`MongoDB conectado: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error de conexión a MongoDB: ${error.message}`);
        return null;
    }
};

module.exports = connectDB; 