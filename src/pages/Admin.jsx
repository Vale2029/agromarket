// src/pages/Admin.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { FaTrash, FaUsers, FaSeedling } from "react-icons/fa";

export default function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [tab, setTab] = useState("usuarios");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const snapU = await getDocs(collection(db, "usuarios"));
      const snapP = await getDocs(collection(db, "productos"));
      setUsuarios(snapU.docs.map((d) => ({ id: d.id, ...d.data() })));
      setProductos(snapP.docs.map((d) => ({ id: d.id, ...d.data() })));
      setCargando(false);
    }
    cargar();
  }, []);

  async function eliminarProducto(id) {
    if (!window.confirm("¿Eliminar este producto?")) return;
    await deleteDoc(doc(db, "productos", id));
    setProductos((prev) => prev.filter((p) => p.id !== id));
  }

  async function eliminarUsuario(id) {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    await deleteDoc(doc(db, "usuarios", id));
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-gray-800 text-white rounded-2xl p-6 mb-8">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <p className="text-gray-400 text-sm mt-1">
          Gestión general de AgroMarket
        </p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{usuarios.length}</div>
            <div className="text-gray-400 text-xs mt-1">
              Usuarios registrados
            </div>
          </div>
          <div className="bg-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{productos.length}</div>
            <div className="text-gray-400 text-xs mt-1">
              Productos publicados
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "usuarios", label: "Usuarios", icon: <FaUsers /> },
          { key: "productos", label: "Productos", icon: <FaSeedling /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition " +
              (tab === t.key
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200")
            }
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {cargando ? (
        <p className="text-center text-gray-400 py-8">Cargando datos...</p>
      ) : tab === "usuarios" ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Rol</th>
                <th className="px-4 py-3 text-left">Vereda</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {u.nombre}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "text-xs px-2 py-1 rounded-full font-medium " +
                        (u.rol === "productor"
                          ? "bg-green-100 text-green-700"
                          : u.rol === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700")
                      }
                    >
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{u.vereda || "—"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => eliminarUsuario(u.id)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productos.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-start"
            >
              <div>
                <h3 className="font-semibold text-gray-800">{p.nombre}</h3>
                <p className="text-green-700 font-bold text-sm">
                  ${p.precio?.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">
                  {p.categoria} · {p.nombreProductor}
                </p>
              </div>
              <button
                onClick={() => eliminarProducto(p.id)}
                className="text-red-400 hover:text-red-600 transition ml-4"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
