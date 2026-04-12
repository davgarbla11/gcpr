// cli.js
require('dotenv').config();
const { pool } = require('./config/db');

// Uso: node cli.js "Barbacoa" "Cervezas,🍺" "Pinchos,🥩"
const eventName = process.argv[2];
const options = process.argv.slice(3);

if (!eventName || options.length === 0) {
    console.log('❌ Uso incorrecto. Ejemplo: node cli.js "Feria" "Rebujitos,🍹" "Bailes,💃"');
    process.exit(1);
}

const createEvent = async () => {
    try {
        await pool.query('BEGIN');
        
        const eventRes = await pool.query(
            'INSERT INTO events (name, description) VALUES ($1, $2) RETURNING id',
            [eventName, 'Evento generado desde CLI']
        );
        const eventId = eventRes.rows[0].id;

        for (const opt of options) {
            const [name, icon] = opt.split(',');
            await pool.query(
                'INSERT INTO event_options (event_id, name, icon) VALUES ($1, $2, $3)',
                [eventId, name, icon || '✅']
            );
        }

        await pool.query('COMMIT');
        console.log(`🎉 Evento '${eventName}' creado con éxito con ${options.length} opciones!`);
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error:', err.message);
    } finally {
        pool.end();
    }
};

createEvent();