const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        enum: ['LONG', 'SHORT', 'GENERAL']
    },
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    par: String,
    entrada: Number,
    stopLoss: Number,
    takeProfit: Number,
    estado: {
        type: String,
        enum: ['ACTIVA', 'COMPLETADA', 'CANCELADA'],
        default: 'ACTIVA'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Update', updateSchema); 