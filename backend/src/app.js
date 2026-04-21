const express = require('express');
const cors = require('cors');

const app = express();

console.log("🔥 app.js cargado");

app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));

app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const turnosRoutes = require('./routes/turnos.routes');

app.use('/api/auth', authRoutes);
app.use('/api/turnos', turnosRoutes);

console.log("📦 authRoutes cargado correctamente");

app.get('/', (req, res) => {
  res.json({ msg: "API Barbería funcionando 💈" });
});

app.listen(3000, () => {
  console.log("🚀 Backend corriendo en puerto 3000");
});