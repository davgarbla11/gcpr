const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'database',
  user: process.env.POSTGRES_USER || 'admin_user',
  password: process.env.POSTGRES_PASSWORD || 'E:4yx%£46[3852;[O?!E*M=',
  database: process.env.POSTGRES_DB || 'pitsi_app',
  port: 5432,
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- NUEVO: Tabla de Eventos
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- NUEVO: Tabla de Opciones (Contadores) de cada Evento
      CREATE TABLE IF NOT EXISTS event_options (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        name VARCHAR(50) NOT NULL,
        icon VARCHAR(20) NOT NULL,
        color VARCHAR(20) DEFAULT '#da2724'
      );

      -- ACTUALIZADO: Consumos vinculados a la opción del evento
      CREATE TABLE IF NOT EXISTS consumptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        event_option_id INTEGER REFERENCES event_options(id) ON DELETE CASCADE,
        amount INTEGER DEFAULT 1,
        consumed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(255);`);
    console.log('✅ Tablas inicializadas para el sistema de Eventos.');
  } catch (err) {
    console.error('❌ Error inicializando la base de datos:', err);
  }
};

module.exports = { pool, initDB };