const { pool } = require('../config/db');

const addConsumption = async (req, res) => {
  try {
    const { event_id, option_id } = req.body; 
    await pool.query(
      'INSERT INTO consumptions (user_id, event_id, event_option_id) VALUES ($1, $2, $3)',
      [req.user.id, event_id, option_id]
    );
    res.json({ success: true, message: `Consumo registrado.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Modificamos para filtrar por Evento
const getStats = async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await pool.query(`
      SELECT o.id as option_id, COUNT(c.id) as total 
      FROM event_options o
      LEFT JOIN consumptions c ON o.id = c.event_option_id AND c.user_id = $1
      WHERE o.event_id = $2
      GROUP BY o.id
    `, [req.user.id, eventId]);
    
    // Devolvemos un objeto donde la KEY es el ID de la opción { "1": 5, "2": 0 }
    const stats = {};
    result.rows.forEach(row => { stats[row.option_id] = parseInt(row.total); });
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// El Ranking ahora también es por evento!
const getLeaderboard = async (req, res) => {
  try {
    const { eventId } = req.params;
    // Hacemos un conteo total de consumos por usuario para ese evento
    const result = await pool.query(`
      SELECT u.username, COUNT(c.id) as total_consumos
      FROM users u
      INNER JOIN consumptions c ON u.id = c.user_id
      WHERE c.event_id = $1
      GROUP BY u.username
      ORDER BY total_consumos DESC
    `, [eventId]);
    res.json({ success: true, leaderboard: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getHistory = async (req, res) => {
  // Lo dejaremos simple: histórico total de ese usuario en ese evento
  try {
    const { eventId } = req.params;
    const result = await pool.query(`
      SELECT TO_CHAR(consumed_at, 'YYYY-MM-DD') as date, event_option_id, COUNT(*) as total
      FROM consumptions
      WHERE user_id = $1 AND event_id = $2 AND consumed_at >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY TO_CHAR(consumed_at, 'YYYY-MM-DD'), event_option_id
      ORDER BY date ASC
    `, [req.user.id, eventId]);
    res.json({ success: true, history: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { addConsumption, getStats, getLeaderboard, getHistory };