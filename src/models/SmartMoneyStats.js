const mongoose = require('mongoose');

const smartMoneyStatsSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    visible: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SmartMoneyStats', smartMoneyStatsSchema); 