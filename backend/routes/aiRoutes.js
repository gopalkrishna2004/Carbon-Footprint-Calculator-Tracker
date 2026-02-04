const express = require('express');
const {
  getRecommendations,
  chat,
  getInsights,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/recommendations', getRecommendations);
router.post('/chat', chat);
router.get('/insights', getInsights);

module.exports = router;
