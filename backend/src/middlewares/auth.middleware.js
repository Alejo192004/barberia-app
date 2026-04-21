const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  try {
    // ==========================
    // 🔐 OBTENER TOKEN DEL HEADER
    // ==========================
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({
        msg: "No hay token ❌"
      });
    }

    // Formato: Bearer TOKEN
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        msg: "Token inválido ❌"
      });
    }

    // ==========================
    // 🔍 VERIFICAR TOKEN
    // ==========================
    const decoded = jwt.verify(token, "secretkey123");

    // 🔥 CLAVE: guardamos el usuario en req
    req.user = decoded;

    // ==========================
    // ➡️ CONTINUAR
    // ==========================
    next();

  } catch (err) {
    console.log("❌ ERROR TOKEN:", err.message);

    return res.status(401).json({
      msg: "Token no válido ❌"
    });
  }
};

module.exports = verificarToken;