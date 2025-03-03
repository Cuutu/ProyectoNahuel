const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceType: {
        type: String,
        required: true,
        enum: ['signals', 'mentoring', 'community'],
        default: 'signals'
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Subscription', subscriptionSchema); 