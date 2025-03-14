const mongoose = require('mongoose');

const informeSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    contenido: {
        type: String,
        required: true
    },
    imagenUrl: {
        type: String
    },
    videoUrl: {
        type: String
    },
    autor: {
        type: String,
        required: true
    },
    fechaPublicacion: {
        type: Date,
        default: Date.now
    },
    destacado: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Informe', informeSchema); 