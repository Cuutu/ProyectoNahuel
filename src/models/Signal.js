const mongoose = require('mongoose');

const signalSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        enum: ['LONG', 'SHORT']
    },
    par: {
        type: String,
        required: true
    },
    entrada: {
        type: Number,
        required: true
    },
    stopLoss: {
        type: Number,
        required: true
    },
    takeProfit: {
        type: Number,
        required: true
    },
    riesgo: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: ['ACTIVA', 'COMPLETADA', 'CANCELADA'],
        default: 'ACTIVA'
    },
    resultado: {
        type: Number,
        default: 0
    },
    esPremium: {
        type: Boolean,
        default: true // Por defecto todas las señales son premium
    },
    suscripcionActiva: {
        type: Boolean,
        default: false // Por defecto la suscripción está inactiva
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    fechaActualizacion: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Signal', signalSchema); 