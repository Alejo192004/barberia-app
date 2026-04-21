import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

import api from "./services/api";
import "./styles.css";

// 📄 PÁGINAS
import Admin from "./pages/Admin";
import Barbero from "./pages/Barbero";
import Cliente from "./pages/Cliente";
import Register from "./pages/Register";

// ==========================
// 🔐 LOGIN
// ==========================
function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      const { token, user } = res.data;

      // 💾 guardar sesión
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login exitoso 🔥");

      // 🔥 REDIRECCIÓN POR ROL
      if (user.rol === "admin") {
        navigate("/admin");
      } else if (user.rol === "barbero") {
        navigate("/barbero");
      } else {
        navigate("/cliente");
      }

    } catch (err) {
      console.log(err);
      alert("Error login ❌");
    }
  };

  return (
    <div className="container">
      <h1>💈 Barbería Elite</h1>

      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>
        Entrar
      </button>

      <button onClick={() => navigate("/register")}>
        Crear cuenta
      </button>
    </div>
  );
}

// ==========================
// 🚀 APP PRINCIPAL
// ==========================
function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* 🔐 LOGIN */}
        <Route path="/" element={<Login />} />

        {/* 🆕 REGISTER */}
        <Route path="/register" element={<Register />} />

        {/* 🧑‍💼 ADMIN */}
        <Route path="/admin" element={<Admin />} />

        {/* ✂️ BARBERO */}
        <Route path="/barbero" element={<Barbero />} />

        {/* 👤 CLIENTE */}
        <Route path="/cliente" element={<Cliente />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;