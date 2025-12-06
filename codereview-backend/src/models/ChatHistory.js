const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    userMessage: {
        type: String
    },
    aiResponse: {
        type: String,
        required: true
    },
    reviewType: {
        type: String,
        default: 'general'
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    tokensUsed: {
        type: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
