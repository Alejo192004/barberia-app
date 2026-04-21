import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      const user = res.data.user;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login exitoso 🔥");

      if (user.rol === "admin") navigate("/admin");
      if (user.rol === "barbero") navigate("/barbero");
      if (user.rol === "cliente") navigate("/cliente");

    } catch (err) {
      alert(err.response?.data?.msg || "Error login");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login 💈</h2>

      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
      <br />

      <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
      <br />

      <button onClick={login}>Entrar</button>
    </div>
  );
}