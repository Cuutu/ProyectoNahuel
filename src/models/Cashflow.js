const mongoose = require('mongoose');

const cashflowSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    },
    activo: {
        type: String,
        required: true
    },
    mercado: {
        type: String,
        required: true,
        enum: ['crypto', 'forex', 'stocks', 'commodities']
    },
    tipoFlujo: {
        type: String,
        required: true,
        enum: ['entrada', 'salida']
    },
    volumen: {
        type: Number,
        required: true
    },
    cambio: {
        type: Number,
        required: true
    },
    indiceLiquidez: {
        type: Number,
        min: 0,
        max: 100
    },
    presionCompradora: {
        type: Number,
        min: 0,
        max: 100
    },
    presionVendedora: {
        type: Number,
        min: 0,
        max: 100
    },
    notas: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cashflow', cashflowSchema); 