const mongoose = require('mongoose');

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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema); 