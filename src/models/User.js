const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
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
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password solo requerido si no es login con Google
        }
    },
    telefono: {
        type: String,
        required: function() {
            return !this.googleId; // Teléfono solo requerido si no es login con Google
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema); 