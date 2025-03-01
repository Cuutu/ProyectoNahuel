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
    }
});

module.exports = mongoose.model('Stats', StatsSchema); 