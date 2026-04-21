const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ msg: "No hay token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, "secretkey123");

    req.user = decoded;

    next();

  } catch (err) {
    console.log("❌ ERROR AUTH:", err.message);
    return res.status(401).json({ msg: "Token inválido" });
  }
};