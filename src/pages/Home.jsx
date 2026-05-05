// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ProductCard from "../components/ProductCard";
import {
  FaSeedling,
  FaHandshake,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";

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
      setProductos(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
    cargarProductos();
  }, []);

  function handleBuscar(e) {
    e.preventDefault();
    if (busqueda.trim()) navigate("/productos?q=" + busqueda);
  }

  return (
    <div>
      {/* HERO */}
      <section
        className="relative min-h-[560px] flex items-center justify-center text-white text-center px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.52), rgba(0,0,0,0.52)),
            url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1400')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-2xl fade-up-1">
          <span
            style={{
              display: "inline-block",
              background: "rgba(133,194,82,0.2)",
              border: "1px solid rgba(133,194,82,0.5)",
              color: "#a8d96e",
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "6px 16px",
              borderRadius: "20px",
              marginBottom: "20px",
            }}
          >
            Tipacoque, Boyacá — Directo del campo
          </span>

          <h1
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(36px, 6vw, 60px)",
              fontWeight: "700",
              lineHeight: "1.1",
              marginBottom: "16px",
            }}
          >
            Frescura del Campo
            <br />
            <span style={{ color: "#85c252" }}>a tu Puerta</span>
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "#d4d4cc",
              marginBottom: "32px",
              lineHeight: "1.6",
            }}
          >
            Conectamos directamente a productores locales de Tipacoque
            <br />
            con consumidores. Sin intermediarios, precio justo.
          </p>

          <form
            onSubmit={handleBuscar}
            style={{
              display: "flex",
              gap: "0",
              maxWidth: "520px",
              margin: "0 auto",
              borderRadius: "50px",
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
            }}
          >
            <input
              type="text"
              placeholder="Busca papa, duraznos, fresas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                flex: 1,
                padding: "14px 20px",
                border: "none",
                outline: "none",
                fontSize: "14px",
                color: "#1C1C1A",
                background: "white",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#2D5A1B",
                color: "white",
                border: "none",
                padding: "14px 24px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaSearch /> Buscar
            </button>
          </form>
        </div>
      </section>

      {/* CARRUSEL */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "32px",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "28px",
                fontWeight: "700",
                color: "#1C1C1A",
                marginBottom: "6px",
              }}
            >
              Productos recientes del campo
            </h2>
            <div
              style={{
                width: "48px",
                height: "3px",
                background: "#2D5A1B",
                borderRadius: "2px",
              }}
            />
          </div>
          <Link
            to="/productos"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#2D5A1B",
              fontWeight: "600",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            Ver todos <FaArrowRight style={{ fontSize: "12px" }} />
          </Link>
        </div>

        {productos.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "60px 0", color: "#9a9a90" }}
          >
            <FaSeedling
              style={{
                fontSize: "48px",
                color: "#c8dbb8",
                marginBottom: "12px",
                display: "block",
                margin: "0 auto 12px",
              }}
            />
            <p style={{ fontSize: "16px", marginBottom: "8px" }}>
              Aún no hay productos publicados
            </p>
            <Link
              to="/registro"
              style={{ color: "#2D5A1B", fontWeight: "600" }}
            >
              Sé el primero en publicar
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
            className="pb-12"
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
      <section style={{ background: "#EDE8DC", padding: "60px 0" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "28px",
              fontWeight: "700",
              color: "#1C1C1A",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            Explora por categoría
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "#6b6b63",
              fontSize: "14px",
              marginBottom: "32px",
            }}
          >
            Encuentra exactamente lo que buscas
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "14px",
            }}
          >
            {[
              {
                nombre: "Frutas",
                emoji: "🍑",
                slug: "frutas",
                color: "#fff3e0",
              },
              {
                nombre: "Verduras",
                emoji: "🥦",
                slug: "verduras",
                color: "#ecfdf5",
              },
              {
                nombre: "Granos",
                emoji: "🌽",
                slug: "granos",
                color: "#fefce8",
              },
              {
                nombre: "Lácteos",
                emoji: "🥛",
                slug: "lacteos",
                color: "#eff6ff",
              },
              { nombre: "Otros", emoji: "🌿", slug: "otros", color: "#f5f5f4" },
            ].map((cat) => (
              <Link
                key={cat.slug}
                to={"/productos?categoria=" + cat.slug}
                style={{
                  background: cat.color,
                  borderRadius: "14px",
                  padding: "20px 12px",
                  textAlign: "center",
                  textDecoration: "none",
                  border: "1px solid rgba(0,0,0,0.06)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  display: "block",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                  {cat.emoji}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#1C1C1A",
                  }}
                >
                  {cat.nombre}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: "28px",
            fontWeight: "700",
            color: "#1C1C1A",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          Cómo funciona AgroMarket
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#6b6b63",
            fontSize: "14px",
            marginBottom: "40px",
          }}
        >
          Simple, directo y sin intermediarios
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {[
            {
              icon: <FaSeedling />,
              num: "01",
              titulo: "El productor publica",
              desc: "El campesino sube su producto con foto, precio y datos de contacto directo.",
            },
            {
              icon: <FaSearch />,
              num: "02",
              titulo: "El consumidor busca",
              desc: "Cualquier persona explora los productos disponibles sin necesidad de cuenta.",
            },
            {
              icon: <FaHandshake />,
              num: "03",
              titulo: "Contacto directo",
              desc: "El comprador contacta al productor por WhatsApp y acuerdan la entrega.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "28px 24px",
                border: "1px solid #e8e4da",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  fontFamily: "Fraunces, serif",
                  fontSize: "48px",
                  fontWeight: "700",
                  color: "#f0ede6",
                  lineHeight: "1",
                }}
              >
                {item.num}
              </div>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "#f0f7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2D5A1B",
                  fontSize: "20px",
                  marginBottom: "16px",
                }}
              >
                {item.icon}
              </div>
              <h3
                style={{
                  fontFamily: "Fraunces, serif",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#1C1C1A",
                  marginBottom: "8px",
                }}
              >
                {item.titulo}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "#6b6b63",
                  lineHeight: "1.6",
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BANNER CTA */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #1e3d12 0%, #2D5A1B 50%, #3d7a28 100%)",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: "32px",
            fontWeight: "700",
            color: "white",
            marginBottom: "12px",
          }}
        >
          ¿Eres productor de Tipacoque?
        </h2>
        <p
          style={{
            color: "#a8d96e",
            fontSize: "15px",
            marginBottom: "28px",
            maxWidth: "480px",
            margin: "0 auto 28px",
          }}
        >
          Regístrate gratis y empieza a vender tus productos directamente a
          consumidores locales. Tú pones el precio.
        </p>
        <Link
          to="/registro"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "white",
            color: "#2D5A1B",
            fontWeight: "700",
            fontSize: "15px",
            padding: "14px 32px",
            borderRadius: "50px",
            textDecoration: "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-2px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          Registrarme como productor <FaArrowRight />
        </Link>
      </section>
    </div>
  );
}
