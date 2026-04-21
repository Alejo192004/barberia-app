import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const register = async () => {
    try {
      await api.post("/auth/register", {
        nombre,
        email,
        password,
        rol: "cliente" // 🔥 siempre cliente
      });

      alert("Usuario creado 💈");

      navigate("/");

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Error registrando");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Registro 👤</h1>

      <input
        placeholder="Nombre"
        onChange={(e) => setNombre(e.target.value)}
      />
      <br />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={register}>
        Registrarse
      </button>

      <br /><br />

      <button onClick={() => navigate("/")}>
        Volver al login
      </button>
    </div>
  );
}