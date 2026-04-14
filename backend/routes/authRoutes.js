const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const { register, login, getProfile, uploadAvatar, upload, updateAccount } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.post('/avatar', authenticateToken, upload.single('avatar'), uploadAvatar);
router.put('/update', authenticateToken, updateAccount);

module.exports = router;