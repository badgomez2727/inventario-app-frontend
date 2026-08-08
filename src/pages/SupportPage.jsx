import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaWhatsapp, FaMobileAlt, FaQrcode, FaHeart, FaArrowLeft, FaCopy, FaCheck, FaCrown,
} from "react-icons/fa";

// Datos de contacto/pago — cámbialos aquí el día que tengas dominio propio /
// número de WhatsApp Business dedicado. Un solo lugar, nada más que tocar.
const WHATSAPP_NUMBER = "573148520270"; // formato internacional, sin '+' ni espacios
const NEQUI_NUMBER = "3148520270";
const DAVIPLATA_NUMBER = "3148520270";
const BREB_KEY = "3148520270";

const Logo = () => (
  <div className="flex items-center gap-2 flex-shrink-0">
    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-2">
      <span className="text-white font-black text-2xl -rotate-2">V</span>
    </div>
    <span className="text-2xl font-black tracking-tighter text-gray-900">
      Ven<span className="text-emerald-500">dita</span>
    </span>
  </div>
);

const CopyableRow = ({ icon, label, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // Sin acceso al portapapeles (ej. http no seguro): no rompe nada, solo no copia.
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-500 text-lg flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
          <p className="font-black text-gray-900 text-lg">{value}</p>
        </div>
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all active:scale-95"
      >
        {copied ? <FaCheck className="text-emerald-500" /> : <FaCopy />}
        {copied ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
};

const SupportPage = () => {
  const [companyName, setCompanyName] = useState("");
  const [qrError, setQrError] = useState(false);

  const waMessage = companyName.trim()
    ? `Hola, soy de la compañía "${companyName.trim()}" en Vendita. Ya hice el aporte, les comparto el comprobante para activar el plan PRO 🚀`
    : `Hola, ya hice un aporte a Vendita. Les comparto el comprobante para activar el plan PRO 🚀`;

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      <nav className="flex items-center justify-between px-6 py-6 max-w-3xl mx-auto w-full">
        <Logo />
        <Link to="/" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors">
          <FaArrowLeft /> Volver al inicio
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pb-24">
        {/* Header */}
        <div className="text-center pt-6 pb-10">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 text-2xl">
            <FaHeart />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 mb-3">
            Apoya a <span className="text-emerald-500">Vendita</span>
          </h1>
          <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
            Vendita es gratis y lo va a seguir siendo. Si te ha servido para tu negocio,
            tu aporte nos ayuda a mantenerlo funcionando y seguir mejorándolo — y de paso
            te activamos el <span className="font-bold text-gray-700">plan PRO sin límites</span>.
          </p>
        </div>

        {/* Métodos de pago */}
        <div className="space-y-3 mb-8">
          <CopyableRow icon={<FaMobileAlt />} label="Nequi" value={NEQUI_NUMBER} />
          <CopyableRow icon={<FaMobileAlt />} label="Daviplata" value={DAVIPLATA_NUMBER} />
          <CopyableRow icon={<FaMobileAlt />} label="Llave Bre-B" value={BREB_KEY} />
        </div>

        {/* QR */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center justify-center gap-2">
            <FaQrcode /> O escanea el QR desde tu app bancaria
          </p>
          {!qrError ? (
            <img
              src="/qr-donacion.png"
              alt="QR para donar a Vendita"
              onError={() => setQrError(true)}
              className="w-48 h-48 mx-auto rounded-xl border border-gray-200 bg-white object-contain"
            />
          ) : (
            <div className="w-48 h-48 mx-auto rounded-xl border-2 border-dashed border-gray-200 bg-white flex items-center justify-center text-gray-300 text-xs font-bold px-4 text-center">
              QR próximamente
            </div>
          )}
        </div>

        {/* Aviso por WhatsApp */}
        <div className="bg-gray-900 rounded-[2rem] p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xl">
            <FaCrown />
          </div>
          <h3 className="text-white font-black text-xl mb-2">¿Ya hiciste el aporte?</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
            Escríbenos por WhatsApp con el comprobante y el nombre de tu compañía
            registrada en Vendita, y te activamos el plan PRO al toque.
          </p>

          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Nombre de tu compañía en Vendita (opcional)"
            className="w-full max-w-sm mx-auto block mb-4 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-emerald-500 text-white font-black px-8 py-4 rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            <FaWhatsapp size={20} /> Avisar por WhatsApp
          </a>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Cualquier aporte ayuda, no hay un monto mínimo. Gracias por usar Vendita 💚
        </p>
      </div>
    </div>
  );
};

export default SupportPage;
