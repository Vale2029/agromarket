// src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";

export default function ProductCard({ producto }) {
  const {
    id,
    nombre,
    precio,
    categoria,
    vereda,
    imagen,
    whatsappProductor,
    descripcion,
  } = producto;

  const categoriaEstilo = {
    frutas: { bg: "#fff3e0", color: "#b45309", label: "Frutas" },
    verduras: { bg: "#ecfdf5", color: "#065f46", label: "Verduras" },
    granos: { bg: "#fefce8", color: "#854d0e", label: "Granos" },
    lacteos: { bg: "#eff6ff", color: "#1e40af", label: "Lácteos" },
    otros: { bg: "#f5f5f4", color: "#44403c", label: "Otros" },
  };

  const imagenDefault = {
    frutas:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500",
    verduras:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500",
    granos:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500",
    lacteos: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500",
    otros: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500",
  };

  const estilo = categoriaEstilo[categoria] || categoriaEstilo.otros;
  const imgSrc = imagen || imagenDefault[categoria] || imagenDefault.otros;
  const mensaje = encodeURIComponent(
    "Hola! Vi tu producto " +
      nombre +
      " en AgroMarket a $" +
      (precio ? precio.toLocaleString() : "") +
      ". Me interesa, esta disponible?",
  );

  return (
    <div
      className="flex flex-col overflow-hidden group"
      style={{
        background: "white",
        borderRadius: "16px",
        border: "1px solid #e8e4da",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
      }}
    >
      {/* Imagen */}
      <div
        style={{ height: "200px", overflow: "hidden", position: "relative" }}
      >
        <img
          src={imgSrc}
          alt={nombre}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.06)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        {/* Badge categoría */}
        <span
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            background: estilo.bg,
            color: estilo.color,
            fontSize: "11px",
            fontWeight: "600",
            padding: "3px 10px",
            borderRadius: "20px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {estilo.label}
        </span>
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-4">
        <h3
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: "17px",
            fontWeight: "600",
            color: "#1C1C1A",
            marginBottom: "6px",
            lineHeight: "1.3",
          }}
        >
          {nombre}
        </h3>

        {descripcion && (
          <p
            style={{
              fontSize: "13px",
              color: "#6b6b63",
              lineHeight: "1.5",
              marginBottom: "10px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {descripcion}
          </p>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "12px",
            color: "#9a9a90",
            marginBottom: "14px",
          }}
        >
          <FaMapMarkerAlt style={{ color: "#2D5A1B", fontSize: "11px" }} />
          <span>{vereda || "Tipacoque, Boyacá"}</span>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "11px",
                color: "#9a9a90",
                display: "block",
                marginBottom: "1px",
              }}
            >
              Precio
            </span>
            <span
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "22px",
                fontWeight: "700",
                color: "#2D5A1B",
              }}
            >
              ${precio ? precio.toLocaleString() : "0"}
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <Link
              to={"/producto/" + id}
              style={{
                fontSize: "13px",
                fontWeight: "600",
                background: "#1C1C1A",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                transition: "background 0.2s",
                textDecoration: "none",
              }}
            >
              Ver más
            </Link>
            {whatsappProductor && (
              <a
                href={
                  "https://wa.me/57" + whatsappProductor + "?text=" + mensaje
                }
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "#25D366",
                  color: "white",
                  fontSize: "16px",
                  transition: "opacity 0.2s",
                }}
              >
                <FaWhatsapp />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
