const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    datetime: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    googleEventId: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema); 