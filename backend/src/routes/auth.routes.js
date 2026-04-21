const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

// ==========================
// 🧪 TEST
// ==========================
router.get('/test', (req, res) => {
  res.json({ msg: "auth funcionando 💈" });
});

// ==========================
// 👥 VER TODOS LOS USUARIOS
// ==========================
router.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, rol FROM usuarios'
    );

    res.json(result.rows);

  } catch (err) {
    console.log("❌ ERROR USUARIOS:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// ✂️ LISTAR BARBEROS
// ==========================
router.get('/barberos', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nombre FROM usuarios WHERE rol = 'barbero'"
    );

    res.json(result.rows);

  } catch (err) {
    console.log("❌ ERROR BARBEROS:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// 🧑‍💼 ELIMINAR USUARIO
// ==========================
router.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      'DELETE FROM usuarios WHERE id = $1',
      [id]
    );

    res.json({ msg: "Usuario eliminado" });

  } catch (err) {
    console.log("❌ ERROR ELIMINAR USUARIO:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// 🔥 REGISTER
// ==========================
router.post('/register', async (req, res) => {
  console.log("🔥 REGISTER HIT");

  const { nombre, email, password, rol } = req.body;

  try {
    const existe = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({
        msg: "El usuario ya existe"
      });
    }

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, rol`,
      [nombre, email, password, rol]
    );

    res.json({
      msg: "Usuario creado 💈",
      user: result.rows[0]
    });

  } catch (err) {
    console.log("❌ ERROR REGISTER:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// 🔐 LOGIN
// ==========================
router.post('/login', async (req, res) => {
  console.log("🔥 LOGIN HIT");

  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        msg: "Usuario no existe"
      });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.status(400).json({
        msg: "Password incorrecto"
      });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      "secretkey123",
      { expiresIn: "1h" }
    );

    res.json({
      msg: "Login exitoso 🔥",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (err) {
    console.log("❌ ERROR LOGIN:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;