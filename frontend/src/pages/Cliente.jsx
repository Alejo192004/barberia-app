import { useState, useEffect } from "react";
import api from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Cliente() {

  const [fechaHora, setFechaHora] = useState(new Date());
  const [barberoId, setBarberoId] = useState("");

  const [barberos, setBarberos] = useState([]);
  const [turnos, setTurnos] = useState([]);

  const [servicios, setServicios] = useState([]);
  const [servicio, setServicio] = useState("");
  const [precio, setPrecio] = useState(0);

  // 🔐 LOGOUT
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // 👨‍🔧 BARBEROS
  const getBarberos = async () => {
    const res = await api.get("/auth/barberos");
    setBarberos(res.data);
  };

  // 📅 TURNOS
  const getTurnos = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get("/turnos", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setTurnos(res.data);
  };

  // 💈 SERVICIOS
  const getServicios = async () => {
    const res = await api.get("/turnos/servicios");
    setServicios(res.data);
  };

  useEffect(() => {
    getBarberos();
    getTurnos();
    getServicios();
  }, []);

  // 🧑‍💼 CREAR TURNO
  const crearTurno = async () => {
    try {
      if (!barberoId || !servicio) {
        alert("Completa todos los campos ⚠️");
        return;
      }

      const token = localStorage.getItem("token");

      const fecha = fechaHora.toISOString().split("T")[0];
      const hora = fechaHora.toTimeString().slice(0, 5);

      await api.post(
        "/turnos",
        {
          fecha,
          hora,
          barbero_id: parseInt(barberoId),
          servicio,
          precio
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Turno creado 💈");

      getTurnos();

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.error || "Error creando turno ❌");
    }
  };

  return (
    <div className="container">
      <h1>💈 Panel Cliente</h1>

      <button onClick={logout}>Cerrar sesión</button>

      <h3>Agendar Turno</h3>

      {/* 📅 CALENDARIO PRO */}
      <div className="field-group">
        <DatePicker
          selected={fechaHora}
          onChange={(date) => setFechaHora(date)}
          showTimeSelect
          timeFormat="hh:mm aa"
          timeIntervals={30}
          dateFormat="dd/MM/yyyy hh:mm aa"
          minDate={new Date()}
          className="custom-datepicker"
        />
        <label>Fecha y Hora</label>
      </div>

      {/* 👨‍🔧 BARBEROS */}
      <select onChange={(e) => setBarberoId(e.target.value)}>
        <option value="">Selecciona barbero</option>
        {barberos.map((b) => (
          <option key={b.id} value={b.id}>
            {b.nombre}
          </option>
        ))}
      </select>

      {/* 💈 SERVICIOS */}
      <select
        onChange={(e) => {
          const s = servicios.find(
            (x) => x.id === parseInt(e.target.value) // 🔥 FIX AQUÍ
          );
          if (s) {
            setServicio(s.nombre);
            setPrecio(s.precio);
          }
        }}
      >
        <option value="">Selecciona servicio</option>
        {servicios.map((s) => (
          <option key={s.id} value={s.id}>
            {s.nombre} - ${s.precio}
          </option>
        ))}
      </select>

      {/* 💰 PRECIO */}
      {precio > 0 && <p>💰 Precio: ${precio}</p>}

      <button onClick={crearTurno}>
        Crear Turno
      </button>

      <h3>Mis Turnos</h3>

      {turnos.length === 0 ? (
        <p>No tienes turnos</p>
      ) : (
        turnos.map((t) => (
          <div className="card" key={t.id}>
            📅 {new Date(t.fecha).toLocaleDateString()} <br />

            🕒 {new Date(`1970-01-01T${t.hora}`).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            })} <br />

            ✂️ {t.barbero_nombre} <br />
            💈 {t.servicio} <br />
            💰 ${t.precio}
          </div>
        ))
      )}
    </div>
  );
}