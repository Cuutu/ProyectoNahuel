const mongoose = require('mongoose');
const Stats = require('../models/Stats');

const statsSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['landing', 'trader-call', 'smart-money', 'cashflow'],
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    visible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Stats', statsSchema); 