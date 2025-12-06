const ChatHistory = require('../models/ChatHistory');
const User = require('../models/User');
const { analyzeCode } = require('../services/deepseekService');
const crypto = require('crypto');

// Helper to generate cache key
const generateCacheKey = (code, language) => {
    return crypto.createHash('md5').update(`${code}-${language}`).digest('hex');
};

exports.reviewCode = async (req, res) => {
    const { code, language } = req.body;
    const userId = req.user._id;

    if (!code || !language) {
        return res.status(400).json({ message: 'Code and language are required' });
    }

    try {
        // Check Cache
        const cacheKey = `review:${generateCacheKey(code, language)}`;
        let cachedReview = null;

        if (req.app.locals.redisClient && req.app.locals.redisClient.isOpen) {
            try {
                cachedReview = await req.app.locals.redisClient.get(cacheKey);
            } catch (e) {
                console.log('Redis get failed', e);
            }
        }

        if (cachedReview) {
            console.log('Serving from cache');
            return res.status(200).json({
                review: cachedReview,
                cached: true
            });
        }

        // Call DeepSeek API
        const review = await analyzeCode(code, language);

        // Save to Cache (1 hour) if Redis is available
        if (req.app.locals.redisClient && req.app.locals.redisClient.isOpen) {
            try {
                await req.app.locals.redisClient.set(cacheKey, review, {
                    EX: 3600
                });
            } catch (e) {
                console.log('Redis set failed', e);
            }
        }

        // Save to History
        const chatEntry = await ChatHistory.create({
            userId,
            code,
            language,
            aiResponse: review,
            reviewType: 'code-review'
        });

        // Update User Usage
        await User.findByIdAndUpdate(userId, {
            $inc: { 'apiUsage.reviewsCount': 1 }
        });

        res.status(200).json({
            review,
            cached: false,
            historyId: chatEntry._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to review code' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const history = await ChatHistory.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch history' });
    }
};
