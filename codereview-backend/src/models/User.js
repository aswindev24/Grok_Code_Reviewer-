const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    plan: {
        type: String,
        enum: ['free', 'pro'],
        default: 'free'
    },
    apiUsage: {
        tokensUsed: {
            type: Number,
            default: 0
        },
        reviewsCount: {
            type: Number,
            default: 0
        }
    },
    preferences: {
        theme: {
            type: String,
            default: 'dark'
        },
        defaultLanguage: {
            type: String,
            default: 'javascript'
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
