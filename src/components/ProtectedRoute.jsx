// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, soloAdmin = false }) {
  const { usuario, perfil } = useAuth();

  if (!usuario) return <Navigate to="/login" />;
  if (soloAdmin && perfil?.rol !== "admin") return <Navigate to="/" />;

  return children;
}
