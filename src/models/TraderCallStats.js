const mongoose = require('mongoose');

const TraderCallStatsSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    label: {
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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TraderCallStats', TraderCallStatsSchema); 