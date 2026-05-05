// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaLeaf, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const errores = {
    "auth/user-not-found": "No existe una cuenta con ese correo.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/invalid-email": "El correo no es válido.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(errores[err.code] || "Error al iniciar sesión.");
    }
    setCargando(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F5F2EB",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "40px 36px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
          border: "1px solid #e8e4da",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "#2D5A1B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <FaLeaf style={{ color: "white", fontSize: "22px" }} />
          </div>
          <h2
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "26px",
              fontWeight: "700",
              color: "#1C1C1A",
              marginBottom: "6px",
            }}
          >
            Bienvenido de vuelta
          </h2>
          <p style={{ fontSize: "14px", color: "#6b6b63" }}>
            Ingresa a tu cuenta de AgroMarket
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fff5f5",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              padding: "12px 16px",
              fontSize: "13px",
              color: "#dc2626",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div>
            <label
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#1C1C1A",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@email.com"
              style={{
                width: "100%",
                padding: "11px 14px",
                border: "1.5px solid #e8e4da",
                borderRadius: "10px",
                fontSize: "14px",
                color: "#1C1C1A",
                outline: "none",
                background: "white",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#2D5A1B")}
              onBlur={(e) => (e.target.style.borderColor = "#e8e4da")}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#1C1C1A",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={verPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                style={{
                  width: "100%",
                  padding: "11px 40px 11px 14px",
                  border: "1.5px solid #e8e4da",
                  borderRadius: "10px",
                  fontSize: "14px",
                  color: "#1C1C1A",
                  outline: "none",
                  background: "white",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2D5A1B")}
                onBlur={(e) => (e.target.style.borderColor = "#e8e4da")}
              />
              <button
                type="button"
                onClick={() => setVerPass(!verPass)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#9a9a90",
                  cursor: "pointer",
                  fontSize: "15px",
                }}
              >
                {verPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={{
              background: cargando ? "#6b9e52" : "#2D5A1B",
              color: "white",
              border: "none",
              padding: "13px",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: cargando ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              marginTop: "4px",
            }}
          >
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "#6b6b63",
            marginTop: "20px",
          }}
        >
          ¿No tienes cuenta?{" "}
          <Link
            to="/registro"
            style={{
              color: "#2D5A1B",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
