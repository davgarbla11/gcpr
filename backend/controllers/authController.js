const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { pool } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key_for_pitsi_=-+*';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatars/');
    },
    filename: function (req, file, cb) {
        cb(null, `user-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

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

const updateAccount = async (req, res) => {
    const { username, password } = req.body;
    try {
        let query = "UPDATE users SET username = $1";
        let params = [username, req.user.id];

        // Si el usuario quiere cambiar la contraseña, la encriptamos
        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = "UPDATE users SET username = $1, password = $2 WHERE id = $3";
            params = [username, hashedPassword, req.user.id];
        } else {
            query = "UPDATE users SET username = $1 WHERE id = $2";
        }

        await pool.query(query, params);
        res.json({ success: true, message: 'Cuenta actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const userRes = await pool.query('SELECT id, username, email, avatar FROM users WHERE id = $1', [req.user.id]);
        
        const totalRes = await pool.query("SELECT COUNT(*) FROM consumptions WHERE user_id = $1", [req.user.id]);
        const total = parseInt(totalRes.rows[0].count) || 0;

        const consumosEvt = await pool.query("SELECT COUNT(*) FROM consumptions WHERE user_id = $1 AND event_id IS NOT NULL", [req.user.id]);
        const totalEventos = parseInt(consumosEvt.rows[0].count) || 0;

        const totalDiarios = total - totalEventos;

        res.json({ 
            success: true, 
            user: userRes.rows[0], 
            totalConsumos: total,
            consumosDiarios: totalDiarios,
            consumosEventos: totalEventos
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, error: 'No se subió ninguna imagen' });
        
        const avatarUrl = `/api/uploads/avatars/${req.file.filename}`;
        await pool.query('UPDATE users SET avatar = $1 WHERE id = $2', [avatarUrl, req.user.id]);
        
        res.json({ success: true, avatarUrl });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { register, login, getProfile, uploadAvatar, upload, updateAccount };