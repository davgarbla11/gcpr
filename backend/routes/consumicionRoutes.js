const express = require('express');
const router = express.Router();
const { addConsumption, getStats, getLeaderboard, getHistory } = require('../controllers/consumicionController');
const authenticateToken = require('../middlewares/auth');

// router.post('/', authenticateToken, addConsumption);
// router.get('/stats', authenticateToken, getStats);
// router.get('/leaderboard', authenticateToken, getLeaderboard);
// router.get('/history', authenticateToken, getHistory);


router.post('/', authenticateToken, addConsumption);
router.get('/stats/:eventId', authenticateToken, getStats);
router.get('/leaderboard/:eventId', authenticateToken, getLeaderboard);
router.get('/history/:eventId', authenticateToken, getHistory);

module.exports = router;