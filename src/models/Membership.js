const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    membershipType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MembershipType',
        required: true
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
    actualPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active'
    },
    paymentInfo: {
        transactionId: String,
        paymentMethod: String,
        paymentDate: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Membership', membershipSchema); 