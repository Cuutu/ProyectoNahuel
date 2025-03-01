const mongoose = require('mongoose');

const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        throw error;
    }
};

module.exports = connectDB; 