const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
    // Alertas (anteriormente Servicios)
    alertas: {
        type: String,
        enum: ['free', 'basic', 'premium', 'pro'],
        default: 'free'
    },
    // Entrenamientos
    entrenamientos: {
        type: String,
        enum: ['free', 'basic', 'premium', 'pro'],
        default: 'free'
    },
    // Asesoramiento
    asesoramiento: {
        type: Boolean,
        default: false
    },
    // Fechas de vencimiento para cada tipo
    vencimientoAlertas: Date,
    vencimientoEntrenamientos: Date,
    vencimientoAsesoramiento: Date
});

const userSchema = new mongoose.Schema({
    googleId: String,
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telefono: String,
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    membership: {
        name: String,
        startDate: Date,
        endDate: Date,
        status: {
            type: String,
            enum: ['active', 'inactive', 'pending'],
            default: 'inactive'
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    membresias: membershipSchema,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema); 