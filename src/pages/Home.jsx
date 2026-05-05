// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ProductCard from "../components/ProductCard";
import { FaSeedling, FaHandshake, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarProductos() {
      const q = query(
        collection(db, "productos"),
        orderBy("creadoEn", "desc"),
        limit(8),
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProductos(data);
    }
    cargarProductos();
  }, []);

  function handleBuscar(e) {
    e.preventDefault();
    if (busqueda.trim()) navigate(`/productos?q=${busqueda}`);
  }

  return (
    <div>
      {/* HERO */}
      <section
        className="relative min-h-[500px] flex items-center justify-center text-white text-center px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
            url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1400')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Frescura del Campo
            <br />
            <span className="text-verde-300">a tu Puerta</span>
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            Conectamos directamente a los productores locales de Tipacoque con
            el mundo. Sin intermediarios, precio justo.
          </p>
          <form onSubmit={handleBuscar} className="flex gap-2 max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Busca papa, duraznos, fresas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 px-4 py-3 rounded-l-full text-gray-800 text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-verde-600 hover:bg-verde-700 px-6 py-3 rounded-r-full font-semibold flex items-center gap-2 transition"
            >
              <FaSearch /> Buscar
            </button>
          </form>
        </div>
      </section>

      {/* CARRUSEL DE PRODUCTOS */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            🌿 Productos recientes del campo
          </h2>
          <Link
            to="/productos"
            className="text-verde-700 hover:text-verde-800 text-sm font-medium"
          >
            Ver todos →
          </Link>
        </div>

        {productos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FaSeedling className="text-5xl mx-auto mb-3 text-verde-300" />
            <p>Aún no hay productos publicados.</p>
            <Link
              to="/registro"
              className="text-verde-600 font-medium mt-2 inline-block"
            >
              ¡Sé el primero en publicar!
            </Link>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            className="pb-10"
          >
            {productos.map((p) => (
              <SwiperSlide key={p.id}>
                <ProductCard producto={p} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      {/* CATEGORÍAS */}
      <section className="bg-verde-50 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Explora por categoría
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { nombre: "Frutas", emoji: "🍑", slug: "frutas" },
              { nombre: "Verduras", emoji: "🥦", slug: "verduras" },
              { nombre: "Granos", emoji: "🌽", slug: "granos" },
              { nombre: "Lácteos", emoji: "🥛", slug: "lacteos" },
              { nombre: "Otros", emoji: "🌿", slug: "otros" },
            ].map((cat) => (
              <Link
                key={cat.slug}
                to={`/productos?categoria=${cat.slug}`}
                className="bg-white rounded-xl p-4 text-center shadow hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <div className="text-sm font-medium text-gray-700">
                  {cat.nombre}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">
          ¿Cómo funciona AgroMarket?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaSeedling className="text-3xl text-verde-600" />,
              titulo: "El productor publica",
              desc: "El campesino sube su producto con foto, precio y datos de contacto directo.",
            },
            {
              icon: <FaSearch className="text-3xl text-verde-600" />,
              titulo: "El consumidor busca",
              desc: "Cualquier persona puede explorar los productos disponibles sin crear cuenta.",
            },
            {
              icon: <FaHandshake className="text-3xl text-verde-600" />,
              titulo: "Contacto directo",
              desc: "El comprador contacta al productor por WhatsApp y acuerdan la entrega. Sin intermediarios.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {item.titulo}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BANNER LLAMADO A ACCIÓN */}
      <section className="bg-verde-800 text-white py-12 text-center px-4">
        <h2 className="text-2xl font-bold mb-3">
          ¿Eres productor de Tipacoque?
        </h2>
        <p className="text-gray-200 mb-6 max-w-lg mx-auto text-sm">
          Regístrate gratis y empieza a vender tus productos directamente a
          consumidores locales. Tú pones el precio.
        </p>
        <Link
          to="/registro"
          className="bg-white text-verde-800 font-bold px-8 py-3 rounded-full hover:bg-verde-50 transition"
        >
          Registrarme como productor
        </Link>
      </section>
    </div>
  );
}
