const express = require('express');
const path = require('path');
const { initDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const consumicionRoutes = require('./routes/consumicionRoutes');
const eventRoutes = require('./routes/eventRoutes'); 

// 1. INICIALIZAS LA APP PRIMERO
const app = express();
const PORT = process.env.PORT || 3003;

// 2. CONFIGURAS LOS MIDDLEWARES BÁSICOS
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  next();
});

// 3. INICIAS LA BASE DE DATOS
initDB();

// 4. APLICAS TODAS LAS RUTAS AL FINAL (Ahora 'app' ya existe)
app.use('/api/auth', authRoutes);
app.use('/api/consume', consumicionRoutes);
app.use('/api/events', eventRoutes); // <-- Y la pones aquí con sus hermanas

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', message: `Servidor PITSI funcionando en puerto ${PORT}` });
});

// 5. ARRANCAS EL SERVIDOR
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor PITSI escuchando en ${PORT}`);
});