// src/pages/Registro.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaLeaf } from "react-icons/fa";

export default function Registro() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmar: "",
    rol: "consumidor",
    whatsapp: "",
    vereda: "",
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const { registrar } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmar)
      return setError("Las contraseñas no coinciden.");
    if (form.password.length < 6)
      return setError("La contraseña debe tener al menos 6 caracteres.");
    setCargando(true);
    try {
      await registrar(form.email, form.password, {
        nombre: form.nombre,
        rol: form.rol,
        whatsapp: form.whatsapp,
        vereda: form.vereda,
      });
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use")
        setError("Ese correo ya está registrado.");
      else setError("Error al registrarse. Intenta de nuevo.");
    }
    setCargando(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <FaLeaf className="text-verde-600 text-4xl mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            Únete a AgroMarket
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Crea tu cuenta gratis en segundos
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
              Nombre completo
            </label>
            <input
              name="nombre"
              required
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Carlos Pérez"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-verde-500 focus:ring-1 focus:ring-verde-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Correo electrónico
            </label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="tucorreo@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-verde-500 focus:ring-1 focus:ring-verde-500"
            />
          </div>

          {/* Rol */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              ¿Cómo quieres usar AgroMarket?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  val: "consumidor",
                  label: "🛒 Quiero comprar",
                  desc: "Busco productos frescos",
                },
                {
                  val: "productor",
                  label: "🌱 Quiero vender",
                  desc: "Soy agricultor de Tipacoque",
                },
              ].map((op) => (
                <label
                  key={op.val}
                  className={`border-2 rounded-lg p-3 cursor-pointer transition text-center ${form.rol === op.val ? "border-verde-500 bg-verde-50" : "border-gray-200 hover:border-verde-300"}`}
                >
                  <input
                    type="radio"
                    name="rol"
                    value={op.val}
                    checked={form.rol === op.val}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="text-sm font-medium text-gray-800">
                    {op.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{op.desc}</div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              WhatsApp{" "}
              {form.rol === "productor" && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <div className="flex">
              <span className="border border-r-0 border-gray-300 bg-gray-50 px-3 py-2.5 rounded-l-lg text-sm text-gray-500">
                +57
              </span>
              <input
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="3001234567"
                required={form.rol === "productor"}
                className="flex-1 border border-gray-300 rounded-r-lg px-4 py-2.5 text-sm outline-none focus:border-verde-500"
              />
            </div>
          </div>

          {form.rol === "productor" && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Vereda
              </label>
              <select
                name="vereda"
                value={form.vereda}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-verde-500"
              >
                <option value="">Selecciona tu vereda</option>
                {[
                  "Ovachia",
                  "Galván",
                  "Carrera",
                  "Palmar",
                  "Calera",
                  "Cañabravo",
                  "Bavata",
                  "Casco urbano",
                ].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-verde-500 focus:ring-1 focus:ring-verde-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Confirmar contraseña
            </label>
            <input
              name="confirmar"
              type="password"
              required
              value={form.confirmar}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-verde-500 focus:ring-1 focus:ring-verde-500"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: "100%",
              background: cargando ? "#6b9e52" : "#2D5A1B",
              color: "white",
              border: "none",
              padding: "13px",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: cargando ? "not-allowed" : "pointer",
              marginTop: "8px",
              boxShadow: "0 4px 14px rgba(45, 90, 27, 0.4)",
            }}
          >
            {cargando ? "Creando cuenta..." : "Crear cuenta gratis"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-verde-700 font-medium hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
