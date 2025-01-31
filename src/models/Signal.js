const mongoose = require('mongoose');

const signalSchema = new mongoose.Schema({
    pair: {
        type: String,
        required: true
    },
    entryPrice: {
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
    risk: {
        type: Number,
        required: true
    },
    potentialProfit: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Signal', signalSchema); 