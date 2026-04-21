import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/" />;

  if (role && user.rol !== role) {
    return <Navigate to="/" />;
  }

  return children;
}