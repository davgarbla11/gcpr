const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key_for_pitsi_=-+*';

const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    if (!email || !username || !password) {
        return res.status(400).json({ error: 'Email, usuario y contraseña son obligatorios' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, email, username',
      [email, username, hashedPassword]
    );
    
    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (err) {
  
    if (err.code === '23505') {
        return res.status(400).json({ success: false, error: 'El correo electrónico ya está registrado' });
    }
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
        return res.status(400).json({ error: 'Correo electrónico no encontrado' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
        success: true, 
        token, 
        user: { 
            id: user.id, 
            email: user.email, 
            username: user.username 
        } 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { register, login };