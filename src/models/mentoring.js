const mongoose = require('mongoose');

const mentoringSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: String,
        default: '1 hora'
    },
    price: {
        type: Number,
        default: 99.99
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Mentoring', mentoringSchema); 