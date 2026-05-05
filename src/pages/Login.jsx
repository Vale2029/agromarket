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
      setError(
        errores[err.code] || "Error al iniciar sesión. Intenta de nuevo.",
      );
    }
    setCargando(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <FaLeaf className="text-verde-600 text-4xl mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            Bienvenido de vuelta
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Ingresa a tu cuenta de AgroMarket
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-verde-500 focus:ring-1 focus:ring-verde-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={verPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-verde-500 focus:ring-1 focus:ring-verde-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setVerPass(!verPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {verPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="bg-verde-600 hover:bg-verde-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition mt-2"
          >
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          ¿No tienes cuenta?{" "}
          <Link
            to="/registro"
            className="text-verde-700 font-medium hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
