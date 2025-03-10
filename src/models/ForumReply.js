const mongoose = require('mongoose');

const forumReplySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumTopic',
        required: true
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: {
        type: Date
    },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, {
    timestamps: true
});

// Middleware para actualizar el último mensaje en el tema cuando se crea una respuesta
forumReplySchema.post('save', async function(doc) {
    try {
        const ForumTopic = mongoose.model('ForumTopic');
        await ForumTopic.findByIdAndUpdate(doc.topic, {
            lastReplyDate: doc.createdAt,
            lastReplyUser: doc.author
        });
    } catch (error) {
        console.error('Error actualizando el último mensaje del tema:', error);
    }
});

forumReplySchema.methods.softDelete = function(userId) {
    this.isActive = false;
    this.deletedAt = new Date();
    this.deletedBy = userId;
    return this.save();
};

module.exports = mongoose.model('ForumReply', forumReplySchema); 