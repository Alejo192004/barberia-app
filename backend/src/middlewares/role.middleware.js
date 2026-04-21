const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    const userRol = req.user.rol;

    if (!rolesPermitidos.includes(userRol)) {
      return res.status(403).json({ msg: "No tienes permisos" });
    }

    next();
  };
};

module.exports = verificarRol;