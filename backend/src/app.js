const express = require("express");
const cors = require("cors");

const app = express();

// 🔥 MIDDLEWARES
app.use(cors({
  origin: "*", // 👈 en producción luego puedes poner tu dominio de Vercel
}));

app.use(express.json());

// 🧪 TEST
app.get("/", (req, res) => {
  res.send("API Barbería funcionando 💈");
});

// 🔗 RUTAS
const authRoutes = require("./routes/auth.routes");
const turnosRoutes = require("./routes/turnos.routes");

app.use("/auth", authRoutes);
app.use("/turnos", turnosRoutes);

// 🚀 SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en puerto ${PORT}`);
});