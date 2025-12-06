const express = require('express');
const { reviewCode, getHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/review', protect, reviewCode);
router.get('/history', protect, getHistory);

module.exports = router;
