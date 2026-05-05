// src/pages/Productos.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";
import ProductCard from "../components/ProductCard";
import { FaSearch, FaSeedling } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [searchParams] = useSearchParams();

  const [busqueda, setBusqueda] = useState(searchParams.get("q") || "");
  const [categoria, setCategoria] = useState(
    searchParams.get("categoria") || "",
  );

  useEffect(() => {
    async function cargar() {
      const q = query(collection(db, "productos"), orderBy("creadoEn", "desc"));
      const snap = await getDocs(q);
      setProductos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setCargando(false);
    }
    cargar();
  }, []);

  const filtrados = productos.filter((p) => {
    const coincideCategoria = !categoria || p.categoria === categoria;
    const coincideBusqueda =
      !busqueda.trim() ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.descripcion &&
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase()));
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Productos del campo
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Directamente de los productores de Tipacoque, Boyacá
      </p>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-500"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {["", "frutas", "verduras", "granos", "lacteos", "otros"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoria(cat)}
                className={
                  "px-4 py-2 rounded-lg text-sm font-medium transition " +
                  (categoria === cat
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200")
                }
              >
                {cat === ""
                  ? "Todos"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Resultados */}
      {cargando ? (
        <div className="text-center py-16 text-gray-400">
          <div className="animate-spin text-4xl mb-3">🌿</div>
          <p>Cargando productos...</p>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FaSeedling className="text-5xl mx-auto mb-3 text-green-300" />
          <p className="text-lg font-medium">No se encontraron productos</p>
          <p className="text-sm mt-1">Intenta con otra búsqueda o categoría</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4">
            {filtrados.length} producto(s) encontrado(s)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtrados.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
