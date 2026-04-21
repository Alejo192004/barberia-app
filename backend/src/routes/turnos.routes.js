const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/auth.middleware");

// ============================
// 🧑‍💼 CREAR TURNO (CLIENTE)
// ============================
router.post("/", auth, async (req, res) => {
  try {
    const { fecha, hora, barbero_id, servicio, precio } = req.body;

    // 🔒 VALIDAR SI YA EXISTE TURNO
    const existe = await pool.query(
      `SELECT * FROM turnos 
       WHERE barbero_id = $1 AND fecha = $2 AND hora = $3`,
      [barbero_id, fecha, hora]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: "Ese horario ya está ocupado ❌" });
    }

    // 💾 INSERTAR
    await pool.query(
      `INSERT INTO turnos 
      (fecha, hora, barbero_id, usuario_id, servicio, precio)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [fecha, hora, barbero_id, req.user.id, servicio, precio]
    );

    res.json({ message: "Turno creado 💈" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creando turno ❌" });
  }
});

// ============================
// 📅 TURNOS DEL CLIENTE
// ============================
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, u.nombre AS barbero_nombre
      FROM turnos t
      JOIN usuarios u ON t.barbero_id = u.id
      WHERE t.usuario_id = $1
      ORDER BY t.fecha, t.hora
    `, [req.user.id]);

    res.json(result.rows);

  } catch (err) {
    console.log(err);
  }
});

// ============================
// ✂️ TURNOS DEL BARBERO
// ============================
router.get("/barbero", auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, u.nombre AS cliente_nombre
      FROM turnos t
      JOIN usuarios u ON t.usuario_id = u.id
      WHERE t.barbero_id = $1
      ORDER BY t.fecha, t.hora
    `, [req.user.id]);

    res.json(result.rows);

  } catch (err) {
    console.log(err);
  }
});

// ============================
// 🧑‍💼 TODOS LOS TURNOS (ADMIN)
// ============================
router.get("/all", auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, 
             c.nombre AS cliente_nombre,
             b.nombre AS barbero_nombre
      FROM turnos t
      JOIN usuarios c ON t.usuario_id = c.id
      JOIN usuarios b ON t.barbero_id = b.id
      ORDER BY t.fecha, t.hora
    `);

    res.json(result.rows);

  } catch (err) {
    console.log(err);
  }
});

// ============================
// ❌ ELIMINAR TURNO
// ============================
router.delete("/:id", auth, async (req, res) => {
  try {
    await pool.query("DELETE FROM turnos WHERE id = $1", [req.params.id]);
    res.json({ message: "Turno eliminado" });
  } catch (err) {
    console.log(err);
  }
});

// ============================
// 📋 SERVICIOS DINÁMICOS
// ============================
router.get("/servicios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM servicios");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
});

// ============================
// 📊 ESTADÍSTICAS
// ============================
router.get("/stats", auth, async (req, res) => {
  try {

    // 📅 total turnos hoy
    const total = await pool.query(`
      SELECT COUNT(*) 
      FROM turnos 
      WHERE DATE(fecha) = CURRENT_DATE
    `);

    // 💰 dinero hoy
    const dinero = await pool.query(`
      SELECT COALESCE(SUM(precio),0) 
      FROM turnos 
      WHERE DATE(fecha) = CURRENT_DATE
    `);

    // 👨‍🔧 por barbero
    const porBarbero = await pool.query(`
      SELECT u.nombre, COALESCE(SUM(t.precio),0) AS total
      FROM turnos t
      JOIN usuarios u ON t.barbero_id = u.id
      WHERE DATE(t.fecha) = CURRENT_DATE
      GROUP BY u.nombre
    `);

    res.json({
      totalTurnos: total.rows[0].count,
      ingresos: dinero.rows[0].coalesce,
      porBarbero: porBarbero.rows
    });

  } catch (err) {
    console.log(err);
  }
});

module.exports = router;