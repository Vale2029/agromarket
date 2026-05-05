// src/components/Footer.jsx
import { FaLeaf, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{ background: "#1C1C1A", color: "#F5F2EB" }}
      className="mt-16"
    >
      <div className="max-w-6xl mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Marca */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#2D5A1B" }}
            >
              <FaLeaf className="text-white text-sm" />
            </div>
            <span
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              Agro<span style={{ color: "#85c252" }}>Market</span>
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "#7a7a70", lineHeight: "1.7" }}>
            Conectamos directamente a los productores locales de Tipacoque,
            Boyacá con consumidores. Sin intermediarios, precio justo.
          </p>
          <div
            style={{
              display: "inline-block",
              marginTop: "16px",
              fontSize: "11px",
              fontWeight: "600",
              letterSpacing: "0.08em",
              background: "#2D5A1B",
              color: "white",
              padding: "4px 12px",
              borderRadius: "20px",
              textTransform: "uppercase",
            }}
          >
            Tipacoque, Boyacá
          </div>
        </div>

        {/* Links */}
        <div>
          <h4
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "16px",
              color: "#F5F2EB",
              marginBottom: "16px",
            }}
          >
            Navegación
          </h4>
          <div className="flex flex-col gap-3">
            {[
              { to: "/", label: "Inicio" },
              { to: "/productos", label: "Ver productos" },
              { to: "/registro", label: "Registrarse como productor" },
              { to: "/login", label: "Iniciar sesión" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  fontSize: "14px",
                  color: "#7a7a70",
                  transition: "color 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#85c252")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a70")}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contacto */}
        <div>
          <h4
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "16px",
              color: "#F5F2EB",
              marginBottom: "16px",
            }}
          >
            Contacto
          </h4>
          <div className="flex flex-col gap-3">
            {[
              { icon: <FaMapMarkerAlt />, text: "Tipacoque, Boyacá, Colombia" },
              {
                icon: <FaWhatsapp />,
                text: "Contacto directo con productores",
              },
              { icon: <FaEnvelope />, text: "agromarket.tipacoque@gmail.com" },
            ].map(({ icon, text }, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  style={{
                    color: "#85c252",
                    marginTop: "2px",
                    fontSize: "14px",
                  }}
                >
                  {icon}
                </span>
                <span style={{ fontSize: "14px", color: "#7a7a70" }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div style={{ borderTop: "1px solid #2a2a27" }}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p style={{ fontSize: "12px", color: "#4a4a44" }}>
            2026 AgroMarket Tipacoque — Proyecto universitario UNAD
          </p>
          <p style={{ fontSize: "12px", color: "#4a4a44" }}>
            Ingeniería de Sistemas · Comercio colaborativo rural
          </p>
        </div>
      </div>
    </footer>
  );
}
