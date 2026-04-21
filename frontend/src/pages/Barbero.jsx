import { useEffect, useState } from "react";
import api from "../services/api";

export default function Barbero() {

  const [turnos, setTurnos] = useState([]);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const getTurnos = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get("/turnos/barbero", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setTurnos(res.data);
  };

  useEffect(() => {
    getTurnos();
  }, []);

  return (
    <div className="container">
      <h1>✂️ Panel Barbero</h1>

      <button onClick={logout}>Cerrar sesión</button>

      <h2>Agenda</h2>

      {turnos.map(t => (
        <div className="card" key={t.id}>
          📅 {new Date(t.fecha).toLocaleDateString()} <br />
          🕒 {t.hora} <br />
          👤 {t.cliente_nombre} <br />
          💈 {t.servicio} <br />
          💰 ${t.precio}
        </div>
      ))}
    </div>
  );
}