const { pool } = require('../config/db');

const getEvents = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events ORDER BY created_at DESC');
        res.json({ success: true, events: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getEventOptions = async (req, res) => {
    try {
        const { eventId } = req.params;
        const result = await pool.query('SELECT * FROM event_options WHERE event_id = $1', [eventId]);
        res.json({ success: true, options: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Añade esta función:
const getPublicEventIds = async (req, res) => {
    try {
        const result = await pool.query('SELECT id FROM events');
        res.json({ success: true, events: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// No olvides exportarla añadiéndola al final:
module.exports = { getEvents, getEventOptions, getPublicEventIds };

//module.exports = { getEvents, getEventOptions };