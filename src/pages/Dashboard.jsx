// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  FaSeedling,
  FaPlus,
  FaTrash,
  FaWhatsapp,
  FaTimes,
  FaSave,
  FaUser,
  FaEdit,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaShoppingBasket,
} from "react-icons/fa";

export default function Dashboard() {
  const { usuario, perfil, logout, setPerfil } = useAuth();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({});
  const [guardando, setGuardando] = useState(false);

  // Estado para editar perfil
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [formPerfil, setFormPerfil] = useState({});
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [exitoPerfil, setExitoPerfil] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    async function cargar() {
      const q = query(
        collection(db, "productos"),
        where("uidProductor", "==", usuario.uid),
      );
      const snap = await getDocs(q);
      setProductos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setCargando(false);
    }
    cargar();
  }, [usuario]);

  // Abrir edición de perfil
  function abrirEditarPerfil() {
    setFormPerfil({
      nombre: perfil?.nombre || "",
      whatsapp: perfil?.whatsapp || "",
      vereda: perfil?.vereda || "",
    });
    setEditandoPerfil(true);
  }

  async function guardarPerfil() {
    if (!formPerfil.nombre.trim()) return;
    setGuardandoPerfil(true);
    try {
      await updateDoc(doc(db, "usuarios", usuario.uid), {
        nombre: formPerfil.nombre,
        whatsapp: formPerfil.whatsapp,
        vereda: formPerfil.vereda,
      });
      // Actualizar perfil local sin mutar el objeto del contexto
      setPerfil({
        ...perfil,
        nombre: formPerfil.nombre,
        whatsapp: formPerfil.whatsapp,
        vereda: formPerfil.vereda,
      });
      setEditandoPerfil(false);
      setExitoPerfil(true);
      setTimeout(() => setExitoPerfil(false), 3000);
    } catch {
      alert("Error al guardar el perfil.");
    }
    setGuardandoPerfil(false);
  }

  async function eliminar(id) {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    await deleteDoc(doc(db, "productos", id));
    setProductos((prev) => prev.filter((p) => p.id !== id));
  }

  function abrirEdicion(producto) {
    setEditando(producto.id);
    setFormEdit({
      nombre: producto.nombre || "",
      categoria: producto.categoria || "frutas",
      precio: producto.precio || "",
      cantidad: producto.cantidad || "",
      unidad: producto.unidad || "kg",
      descripcion: producto.descripcion || "",
      imagen: producto.imagen || "",
    });
  }

  async function guardarEdicion(id) {
    setGuardando(true);
    try {
      await updateDoc(doc(db, "productos", id), {
        nombre: formEdit.nombre,
        categoria: formEdit.categoria,
        precio: Number(formEdit.precio),
        cantidad: formEdit.cantidad,
        unidad: formEdit.unidad,
        descripcion: formEdit.descripcion,
        imagen: formEdit.imagen || null,
      });
      setProductos((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, ...formEdit, precio: Number(formEdit.precio) }
            : p,
        ),
      );
      setEditando(null);
    } catch {
      alert("Error al guardar. Intenta de nuevo.");
    }
    setGuardando(false);
  }

  // Mensaje WhatsApp para consumidor interesado
  function mensajeInteres(producto) {
    return encodeURIComponent(
      "Hola " +
        (producto.nombreProductor || "") +
        "! Vi tu producto *" +
        producto.nombre +
        "* en AgroMarket a $" +
        (producto.precio ? producto.precio.toLocaleString() : "") +
        " por " +
        (producto.unidad || "unidad") +
        ". Me gustaria comprarlo. ¿Sigue disponible?",
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* ── HEADER ── */}
      <div className="bg-green-800 text-white rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Mi Panel de Control</h1>
            <p className="text-green-200 text-sm mt-1">
              {perfil?.rol === "productor"
                ? "🌱 Productor"
                : perfil?.rol === "admin"
                  ? "⚙️ Administrador"
                  : "🛒 Consumidor"}{" "}
              · AgroMarket Tipacoque
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {perfil?.rol === "productor" && (
              <Link
                to="/vender"
                className="bg-white text-green-800 font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-green-50 transition"
              >
                <FaPlus /> Publicar producto
              </Link>
            )}
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Stats — solo para productor */}
        {perfil?.rol === "productor" && (
          <div className="grid grid-cols-3 gap-4 mt-5">
            {[
              { label: "Publicaciones", valor: productos.length },
              { label: "WhatsApp", valor: perfil?.whatsapp || "—" },
              { label: "Vereda", valor: perfil?.vereda || "—" },
            ].map((s, i) => (
              <div key={i} className="bg-green-700 rounded-xl p-3 text-center">
                <div className="text-lg font-bold truncate">{s.valor}</div>
                <div className="text-green-200 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── TARJETA DE PERFIL ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FaUser className="text-green-600" /> Mi perfil
          </h2>
          {!editandoPerfil && (
            <button
              onClick={abrirEditarPerfil}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
            >
              <FaEdit /> Editar perfil
            </button>
          )}
        </div>

        {exitoPerfil && (
          <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-2 text-sm mb-4">
            ✅ Perfil actualizado correctamente
          </div>
        )}

        {!editandoPerfil ? (
          /* Vista del perfil */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaUser className="text-green-600" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Nombre</div>
                <div className="font-medium text-gray-800 text-sm">
                  {perfil?.nombre || "—"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="text-green-600" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Correo</div>
                <div className="font-medium text-gray-800 text-sm truncate">
                  {usuario?.email || "—"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaPhone className="text-green-600" />
              </div>
              <div>
                <div className="text-xs text-gray-400">WhatsApp</div>
                <div className="font-medium text-gray-800 text-sm">
                  {perfil?.whatsapp || "—"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaMapMarkerAlt className="text-green-600" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Vereda</div>
                <div className="font-medium text-gray-800 text-sm">
                  {perfil?.vereda || "—"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaSeedling className="text-green-600" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Rol</div>
                <div className="font-medium text-gray-800 text-sm capitalize">
                  {perfil?.rol || "—"}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Formulario editar perfil */
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Nombre completo
                </label>
                <input
                  value={formPerfil.nombre}
                  onChange={(e) =>
                    setFormPerfil({ ...formPerfil, nombre: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  WhatsApp
                </label>
                <div className="flex">
                  <span className="border border-r-0 border-gray-300 bg-gray-100 px-3 py-2 rounded-l-lg text-sm text-gray-500">
                    +57
                  </span>
                  <input
                    value={formPerfil.whatsapp}
                    onChange={(e) =>
                      setFormPerfil({ ...formPerfil, whatsapp: e.target.value })
                    }
                    className="flex-1 border border-gray-300 rounded-r-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Vereda
                </label>
                <select
                  value={formPerfil.vereda}
                  onChange={(e) =>
                    setFormPerfil({ ...formPerfil, vereda: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
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
                    "Tipacoque",
                  ].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <button
                onClick={() => setEditandoPerfil(false)}
                className="px-4 py-2 rounded-lg text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition flex items-center gap-1"
              >
                <FaTimes /> Cancelar
              </button>
              <button
                onClick={guardarPerfil}
                disabled={guardandoPerfil}
                className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition flex items-center gap-2"
              >
                <FaSave />{" "}
                {guardandoPerfil ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════
          VISTA PRODUCTOR — mis productos
      ══════════════════════════════════ */}
      {perfil?.rol === "productor" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Mis productos publicados
            </h2>
            <Link
              to="/vender"
              className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-green-700 transition"
            >
              <FaPlus /> Nuevo
            </Link>
          </div>

          {cargando ? (
            <p className="text-gray-400 text-center py-8">Cargando...</p>
          ) : productos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <FaSeedling className="text-4xl text-green-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">
                Aún no tienes productos publicados
              </p>
              <Link
                to="/vender"
                className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-green-700 transition"
              >
                Publicar mi primer producto
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {productos.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {editando !== p.id ? (
                    <div className="p-4 flex gap-4">
                      <img
                        src={
                          p.imagen ||
                          "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200"
                        }
                        alt={p.nombre}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {p.nombre}
                          </h3>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex-shrink-0">
                            {p.categoria}
                          </span>
                        </div>
                        <p className="text-green-700 font-bold text-lg">
                          ${p.precio?.toLocaleString()}{" "}
                          <span className="text-xs font-normal text-gray-400">
                            / {p.unidad}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400">
                          Disponible: {p.cantidad} {p.unidad}
                        </p>
                        {p.descripcion && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {p.descripcion}
                          </p>
                        )}
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <button
                            onClick={() => abrirEdicion(p)}
                            className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-200 transition"
                          >
                            ✏️ Editar
                          </button>
                          <a
                            href={"https://wa.me/57" + perfil?.whatsapp}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-green-200 transition"
                          >
                            <FaWhatsapp /> WhatsApp
                          </a>
                          <button
                            onClick={() => eliminar(p.id)}
                            className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-red-200 transition"
                          >
                            <FaTrash /> Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 bg-blue-50 border-t-2 border-blue-400">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-blue-800">
                          ✏️ Editando: {p.nombre}
                        </h4>
                        <button
                          onClick={() => setEditando(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">
                            Nombre
                          </label>
                          <input
                            value={formEdit.nombre}
                            onChange={(e) =>
                              setFormEdit({
                                ...formEdit,
                                nombre: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">
                            Categoría
                          </label>
                          <select
                            value={formEdit.categoria}
                            onChange={(e) =>
                              setFormEdit({
                                ...formEdit,
                                categoria: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                          >
                            <option value="frutas">🍑 Frutas</option>
                            <option value="verduras">🥦 Verduras</option>
                            <option value="granos">🌽 Granos</option>
                            <option value="lacteos">🥛 Lácteos</option>
                            <option value="otros">🌿 Otros</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">
                            Precio ($)
                          </label>
                          <input
                            type="number"
                            value={formEdit.precio}
                            onChange={(e) =>
                              setFormEdit({
                                ...formEdit,
                                precio: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">
                            Cantidad y unidad
                          </label>
                          <div className="flex gap-2">
                            <input
                              value={formEdit.cantidad}
                              onChange={(e) =>
                                setFormEdit({
                                  ...formEdit,
                                  cantidad: e.target.value,
                                })
                              }
                              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                            />
                            <select
                              value={formEdit.unidad}
                              onChange={(e) =>
                                setFormEdit({
                                  ...formEdit,
                                  unidad: e.target.value,
                                })
                              }
                              className="border border-gray-300 rounded-lg px-2 py-2 text-sm outline-none focus:border-blue-400"
                            >
                              <option value="kg">kg</option>
                              <option value="libra">libra</option>
                              <option value="bulto">bulto</option>
                              <option value="unidad">unidad</option>
                              <option value="canastilla">canastilla</option>
                            </select>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-medium text-gray-600 mb-1 block">
                            Descripción
                          </label>
                          <textarea
                            value={formEdit.descripcion}
                            onChange={(e) =>
                              setFormEdit({
                                ...formEdit,
                                descripcion: e.target.value,
                              })
                            }
                            rows={2}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-medium text-gray-600 mb-1 block">
                            URL de imagen
                          </label>
                          <input
                            value={formEdit.imagen}
                            onChange={(e) =>
                              setFormEdit({
                                ...formEdit,
                                imagen: e.target.value,
                              })
                            }
                            placeholder="https://..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 justify-end">
                        <button
                          onClick={() => setEditando(null)}
                          className="px-4 py-2 rounded-lg text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition flex items-center gap-1"
                        >
                          <FaTimes /> Cancelar
                        </button>
                        <button
                          onClick={() => guardarEdicion(p.id)}
                          disabled={guardando}
                          className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition flex items-center gap-2"
                        >
                          <FaSave />{" "}
                          {guardando ? "Guardando..." : "Guardar cambios"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════
          VISTA CONSUMIDOR
      ══════════════════════════════════ */}
      {perfil?.rol === "consumidor" && (
        <ConsumidorView mensajeInteres={mensajeInteres} />
      )}

      {/* ══════════════════════════════════
          VISTA ADMIN
      ══════════════════════════════════ */}
      {perfil?.rol === "admin" && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <div className="text-4xl mb-3">⚙️</div>
          <p className="text-gray-600 font-medium mb-1">
            Tienes acceso de administrador
          </p>
          <p className="text-gray-400 text-sm mb-5">
            Gestiona usuarios y publicaciones desde el panel admin
          </p>
          <Link
            to="/admin"
            className="bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-gray-900 transition font-medium"
          >
            Ir al panel de administración
          </Link>
        </div>
      )}
    </div>
  );
}

/* ── Componente separado para el consumidor ── */
function ConsumidorView({ mensajeInteres }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const { collection, getDocs, orderBy, query, limit } =
        await import("firebase/firestore");
      const q = query(
        collection(db, "productos"),
        orderBy("creadoEn", "desc"),
        limit(6),
      );
      const snap = await getDocs(q);
      setProductos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setCargando(false);
    }
    cargar();
  }, []);

  const imagenDefault = {
    frutas:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400",
    verduras:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
    granos:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
    lacteos: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
    otros: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FaShoppingBasket className="text-green-600" /> Productos disponibles
        </h2>
        <Link
          to="/productos"
          className="text-sm text-green-700 hover:text-green-800 font-medium"
        >
          Ver todos →
        </Link>
      </div>

      {cargando ? (
        <p className="text-center text-gray-400 py-8">Cargando productos...</p>
      ) : productos.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">
          <FaSeedling className="text-4xl text-green-200 mx-auto mb-2" />
          <p className="text-gray-400">Aún no hay productos publicados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productos.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex"
            >
              <img
                src={
                  p.imagen || imagenDefault[p.categoria] || imagenDefault.otros
                }
                alt={p.nombre}
                className="w-24 h-24 object-cover flex-shrink-0"
              />
              <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">
                      {p.nombre}
                    </h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex-shrink-0">
                      {p.categoria}
                    </span>
                  </div>
                  <p className="text-green-700 font-bold">
                    ${p.precio?.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-gray-400">
                      /{p.unidad}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <FaMapMarkerAlt className="text-green-500" />{" "}
                    {p.vereda || "Tipacoque"}
                  </p>
                </div>
                <div className="flex gap-2 mt-2">
                  <a
                    href={
                      "https://wa.me/57" +
                      p.whatsappProductor +
                      "?text=" +
                      mensajeInteres(p)
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1.5 rounded-lg flex items-center justify-center gap-1 transition"
                  >
                    <FaWhatsapp /> Estoy interesado
                  </a>
                  <Link
                    to={"/producto/" + p.id}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1.5 rounded-lg transition"
                  >
                    Ver más
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
        <p className="font-medium mb-1">💡 ¿Cómo funciona?</p>
        <p className="text-green-700 text-xs leading-relaxed">
          Al hacer clic en <strong>"Estoy interesado"</strong> se abre WhatsApp
          con un mensaje directo al productor. Tú y el productor acuerdan
          precio, cantidad y punto de entrega. Sin intermediarios.
        </p>
      </div>
    </div>
  );
}
