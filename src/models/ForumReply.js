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
    }
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

module.exports = mongoose.model('ForumReply', forumReplySchema); 