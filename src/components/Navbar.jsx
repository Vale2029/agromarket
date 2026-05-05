// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaLeaf, FaBars, FaTimes, FaUser } from "react-icons/fa";
import { useState } from "react";

export default function Navbar() {
  const { usuario, perfil, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  const esActivo = (path) => location.pathname === path;

  return (
    <nav style={{ background: "#1C1C1A" }} className="sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#2D5A1B" }}
          >
            <FaLeaf className="text-white text-sm" />
          </div>
          <span
            style={{ fontFamily: "Fraunces, serif", color: "#F5F2EB" }}
            className="text-xl font-bold tracking-tight"
          >
            Agro<span style={{ color: "#85c252" }}>Market</span>
          </span>
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {[
            { to: "/", label: "Inicio" },
            { to: "/productos", label: "Productos" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                color: esActivo(to) ? "#85c252" : "#b5b5a8",
                borderBottom: esActivo(to)
                  ? "2px solid #85c252"
                  : "2px solid transparent",
                paddingBottom: "2px",
                transition: "all 0.2s",
              }}
            >
              {label}
            </Link>
          ))}
          {usuario && perfil?.rol === "productor" && (
            <Link
              to="/vender"
              style={{
                color: esActivo("/vender") ? "#85c252" : "#b5b5a8",
                paddingBottom: "2px",
                borderBottom: esActivo("/vender")
                  ? "2px solid #85c252"
                  : "2px solid transparent",
              }}
            >
              Publicar
            </Link>
          )}
          {usuario && perfil?.rol === "admin" && (
            <Link
              to="/admin"
              style={{
                color: "#b5b5a8",
                paddingBottom: "2px",
                borderBottom: "2px solid transparent",
              }}
            >
              Admin
            </Link>
          )}
        </div>

        {/* Botones sesión */}
        <div className="hidden md:flex items-center gap-3">
          {usuario ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition"
                style={{
                  background: "#2a2a27",
                  color: "#F5F2EB",
                  border: "1px solid #3a3a36",
                }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{ background: "#2D5A1B", color: "white" }}
                >
                  <FaUser style={{ fontSize: "10px" }} />
                </div>
                {perfil?.nombre?.split(" ")[0] || "Mi perfil"}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 rounded-full transition font-medium"
                style={{
                  background: "#3a1a1a",
                  color: "#f09595",
                  border: "1px solid #5a2a2a",
                }}
              >
                Salir
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium transition"
                style={{ color: "#b5b5a8" }}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="text-sm font-semibold px-5 py-2 rounded-full transition"
                style={{
                  background: "#2D5A1B",
                  color: "white",
                  boxShadow: "0 2px 12px rgba(45,90,27,0.4)",
                }}
              >
                Unirse
              </Link>
            </>
          )}
        </div>

        {/* Móvil */}
        <button
          className="md:hidden text-xl"
          style={{ color: "#F5F2EB" }}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menú móvil */}
      {menu && (
        <div
          className="md:hidden px-5 pb-5 flex flex-col gap-4 text-sm font-medium"
          style={{ background: "#242420", borderTop: "1px solid #2a2a27" }}
        >
          <Link
            to="/"
            onClick={() => setMenu(false)}
            style={{ color: "#b5b5a8" }}
            className="pt-4"
          >
            Inicio
          </Link>
          <Link
            to="/productos"
            onClick={() => setMenu(false)}
            style={{ color: "#b5b5a8" }}
          >
            Productos
          </Link>
          {usuario && perfil?.rol === "productor" && (
            <Link
              to="/vender"
              onClick={() => setMenu(false)}
              style={{ color: "#b5b5a8" }}
            >
              Publicar
            </Link>
          )}
          {usuario ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMenu(false)}
                style={{ color: "#b5b5a8" }}
              >
                Mi panel
              </Link>
              <button
                onClick={handleLogout}
                className="text-left"
                style={{ color: "#f09595" }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenu(false)}
                style={{ color: "#b5b5a8" }}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                onClick={() => setMenu(false)}
                style={{ color: "#85c252" }}
              >
                Unirse gratis
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
