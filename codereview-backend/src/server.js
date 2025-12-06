require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const { createClient } = require('redis');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Connect to Redis
const redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
        reconnectStrategy: false
    }
});

redisClient.on('error', (err) => {
    // Suppress errors if Redis is not available
    console.log('Redis Client Error: Redis not available, using in-memory fallback.');
});

redisClient.on('connect', () => console.log('Redis Client Connected'));

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.log('Failed to connect to Redis. Features requiring Redis will use fallback.');
    }
})();

app.locals.redisClient = redisClient;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
