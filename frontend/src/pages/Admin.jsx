import { useEffect, useState } from "react";
import api from "../services/api";

export default function Admin() {

  const [usuarios, setUsuarios] = useState([]);
  const [turnos, setTurnos] = useState([]);

  // 📊 STATS
  const [stats, setStats] = useState(null);

  // ✂️ CREAR BARBERO
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔐 LOGOUT
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // 👥 USUARIOS
  const getUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/auth/usuarios", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsuarios(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 📅 TURNOS
  const getTurnos = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/turnos/all", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTurnos(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 📊 STATS
  const getStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/turnos/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ❌ ELIMINAR USUARIO
  const eliminarUsuario = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/auth/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      getUsuarios();
    } catch (err) {
      console.log(err);
    }
  };

  // ❌ ELIMINAR TURNO
  const eliminarTurno = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/turnos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      getTurnos();
      getStats(); // 🔥 actualizar ingresos
    } catch (err) {
      console.log(err);
    }
  };

  // ✂️ CREAR BARBERO
  const crearBarbero = async () => {
    try {
      if (!nombre || !email || !password) {
        alert("Completa todos los campos ⚠️");
        return;
      }

      const token = localStorage.getItem("token");

      await api.post("/auth/register", {
        nombre,
        email,
        password,
        rol: "barbero"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Barbero creado 💈");

      setNombre("");
      setEmail("");
      setPassword("");

      getUsuarios();
    } catch (err) {
      console.log(err);
      alert("Error creando barbero ❌");
    }
  };

  useEffect(() => {
    getUsuarios();
    getTurnos();
    getStats();
  }, []);

  return (
    <div className="admin-container">

      <h1>🧑‍💼 Panel Admin</h1>

      <button onClick={logout}>
        Cerrar sesión
      </button>

      {/* 📊 ESTADÍSTICAS */}
      {stats && (
        <div className="section">
          <h2>Estadísticas 📊</h2>

          <p>Turnos hoy: {stats.totalTurnos}</p>
          <p>Ingresos: ${stats.ingresos}</p>

          <h3>Por barbero</h3>
          {stats.porBarbero.map((b, i) => (
            <p key={i}>
              {b.nombre}: ${b.total}
            </p>
          ))}
        </div>
      )}

      {/* ✂️ CREAR BARBERO */}
      <div className="section">
        <h2>Crear Barbero ✂️</h2>

        <div className="field-group">
          <input
            placeholder=" "
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <label>Nombre</label>
        </div>

        <div className="field-group">
          <input
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
        </div>

        <div className="field-group">
          <input
            type="password"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
        </div>

        <button onClick={crearBarbero}>
          Crear Barbero
        </button>
      </div>

      {/* 👥 USUARIOS */}
      <div className="section">
        <h2>Usuarios 👥</h2>

        {usuarios.length === 0 ? (
          <p>No hay usuarios</p>
        ) : (
          usuarios.map((u) => (
            <div className="user-item" key={u.id}>
              <span>
                {u.nombre} - {u.email} ({u.rol})
              </span>

              <button
                className="btn-delete"
                onClick={() => eliminarUsuario(u.id)}
              >
                ❌
              </button>
            </div>
          ))
        )}
      </div>

      {/* 📅 TURNOS */}
      <div className="section">
        <h2>Turnos 📅</h2>

        {turnos.length === 0 ? (
          <p>No hay turnos</p>
        ) : (
          turnos.map((t) => (
            <div className="turno-item" key={t.id}>
              <p>📅 {new Date(t.fecha).toLocaleDateString()}</p>
              <p>🕒 {t.hora}</p>
              <p>👤 Cliente: {t.cliente_nombre}</p>
              <p>✂️ Barbero: {t.barbero_nombre}</p>

              {/* 💈 NUEVO */}
              <p>💈 Servicio: {t.servicio}</p>
              <p>💰 Precio: ${t.precio}</p>

              <button
                className="btn-delete"
                onClick={() => eliminarTurno(t.id)}
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}