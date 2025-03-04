const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    visible: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        enum: ['landing', 'trader-call'],
        default: 'landing'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Stats', StatsSchema); 