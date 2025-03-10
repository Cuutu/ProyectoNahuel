const mongoose = require('mongoose');

const forumTopicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumCategory',
        required: true
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    lastReplyDate: {
        type: Date,
        default: Date.now
    },
    lastReplyUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, {
    timestamps: true
});

forumTopicSchema.methods.softDelete = function(userId) {
    this.isActive = false;
    this.deletedAt = new Date();
    this.deletedBy = userId;
    return this.save();
};

module.exports = mongoose.model('ForumTopic', forumTopicSchema); 