const express = require('express');
const router = express.Router();
const { getEvents, getEventOptions, getPublicEventIds } = require('../controllers/eventController');
const authenticateToken = require('../middlewares/auth');

// NUEVA RUTA PÚBLICA (Sin authenticateToken):
router.get('/public/ids', getPublicEventIds);

// Tus rutas privadas de siempre:
router.get('/', authenticateToken, getEvents);
router.get('/:eventId/options', authenticateToken, getEventOptions);

module.exports = router;