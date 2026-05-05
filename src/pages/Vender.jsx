// src/pages/Vender.jsx
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaSeedling } from "react-icons/fa";

export default function Vender() {
  const { usuario, perfil } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    categoria: "frutas",
    precio: "",
    cantidad: "",
    unidad: "kg",
    descripcion: "",
    imagen: "",
  });
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre || !form.precio || !form.cantidad) {
      return setError("Por favor completa los campos obligatorios.");
    }
    setCargando(true);
    setError("");
    try {
      await addDoc(collection(db, "productos"), {
        nombre: form.nombre,
        categoria: form.categoria,
        precio: Number(form.precio),
        cantidad: form.cantidad,
        unidad: form.unidad,
        descripcion: form.descripcion,
        imagen: form.imagen || null,
        whatsappProductor: perfil?.whatsapp || "",
        nombreProductor: perfil?.nombre || "",
        vereda: perfil?.vereda || "",
        uidProductor: usuario.uid,
        creadoEn: serverTimestamp(),
      });
      setExito(true);
      setForm({
        nombre: "",
        categoria: "frutas",
        precio: "",
        cantidad: "",
        unidad: "kg",
        descripcion: "",
        imagen: "",
      });
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch {
      setError("Error al publicar. Intenta de nuevo.");
    }
    setCargando(false);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <FaSeedling className="text-green-600 text-4xl mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            Publicar mi cosecha
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Tu producto llegará directo al consumidor
          </p>
        </div>

        {exito && (
          <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3 text-sm mb-4 text-center">
            ✅ ¡Producto publicado exitosamente! Redirigiendo...
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Nombre del producto <span className="text-red-500">*</span>
            </label>
            <input
              name="nombre"
              required
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Durazno criollo, Papa pastusa"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Categoría
              </label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500"
              >
                <option value="frutas">🍑 Frutas</option>
                <option value="verduras">🥦 Verduras</option>
                <option value="granos">🌽 Granos</option>
                <option value="lacteos">🥛 Lácteos</option>
                <option value="otros">🌿 Otros</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Unidad de venta
              </label>
              <select
                name="unidad"
                value={form.unidad}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500"
              >
                <option value="kg">Kilogramo (kg)</option>
                <option value="libra">Libra</option>
                <option value="bulto">Bulto</option>
                <option value="unidad">Unidad</option>
                <option value="canastilla">Canastilla</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Precio ($) <span className="text-red-500">*</span>
              </label>
              <input
                name="precio"
                type="number"
                required
                value={form.precio}
                onChange={handleChange}
                placeholder="Ej: 2500"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Cantidad disponible <span className="text-red-500">*</span>
              </label>
              <input
                name="cantidad"
                required
                value={form.cantidad}
                onChange={handleChange}
                placeholder="Ej: 50"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              placeholder="Describe tu producto: frescura, origen, características..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              URL de imagen{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              name="imagen"
              value={form.imagen}
              onChange={handleChange}
              placeholder="https://... (deja vacío para imagen automática)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Si no pones imagen, se asigna una automáticamente según la
              categoría.
            </p>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition mt-2"
          >
            {cargando ? "Publicando..." : "🌿 Publicar producto"}
          </button>
        </form>
      </div>
    </div>
  );
}
