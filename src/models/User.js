const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                return v.endsWith('@gmail.com');
            },
            message: 'El email debe ser de dominio @gmail.com'
        }
    },
    password: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema); 