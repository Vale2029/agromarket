// src/pages/ProductoDetalle.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  FaWhatsapp,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaUser,
  FaTag,
} from "react-icons/fa";

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  const imagenDefault = {
    frutas:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800",
    verduras:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800",
    granos:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800",
    lacteos: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800",
    otros: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800",
  };

  useEffect(() => {
    async function cargar() {
      const snap = await getDoc(doc(db, "productos", id));
      if (snap.exists()) setProducto({ id: snap.id, ...snap.data() });
      setCargando(false);
    }
    cargar();
  }, [id]);

  if (cargando)
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="animate-spin text-4xl mb-3">🌿</div>
        <p>Cargando producto...</p>
      </div>
    );

  if (!producto)
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Producto no encontrado</p>
        <Link to="/productos" className="text-green-600 hover:underline">
          ← Volver a productos
        </Link>
      </div>
    );

  const imagenSrc =
    producto.imagen || imagenDefault[producto.categoria] || imagenDefault.otros;
  const mensajeWsp =
    "Hola! Vi tu producto " +
    producto.nombre +
    " en AgroMarket por $" +
    (producto.precio ? producto.precio.toLocaleString() : "") +
    ". Me interesa, esta disponible?";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/productos"
        className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 text-sm mb-6 font-medium"
      >
        <FaArrowLeft /> Volver a productos
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Imagen */}
          <div className="md:w-1/2">
            <img
              src={imagenSrc}
              alt={producto.nombre}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                {producto.categoria}
              </span>
              <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-2">
                {producto.nombre}
              </h1>
              <p className="text-3xl font-bold text-green-700 mb-4">
                ${producto.precio ? producto.precio.toLocaleString() : "0"}
                <span className="text-sm font-normal text-gray-400 ml-1">
                  / {producto.unidad || "unidad"}
                </span>
              </p>

              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {producto.descripcion || "Producto fresco directo del campo."}
              </p>

              <div className="flex flex-col gap-2 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-green-600" />
                  <span>{producto.vereda || "Tipacoque"}, Boyacá</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTag className="text-green-600" />
                  <span>
                    Disponible: {producto.cantidad || "Consultar"}{" "}
                    {producto.unidad || "unidades"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUser className="text-green-600" />
                  <span>
                    Productor: {producto.nombreProductor || "Productor local"}
                  </span>
                </div>
              </div>
            </div>

            {/* Botón WhatsApp */}
            {producto.whatsappProductor && (
              <a
                href={
                  "https://wa.me/57" +
                  producto.whatsappProductor +
                  "?text=" +
                  encodeURIComponent(mensajeWsp)
                }
                target="_blank"
                rel="noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-3 transition text-base"
              >
                <FaWhatsapp className="text-xl" />
                Contactar por WhatsApp
              </a>
            )}

            <p className="text-xs text-gray-400 text-center mt-3">
              Al contactar, hablas directamente con el productor. Sin
              intermediarios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
