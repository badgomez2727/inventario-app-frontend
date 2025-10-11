import React from "react";

export default function TestTailwind() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-800">🚀 Tailwind Prueba</h1>
        <p className="mt-4 text-lg text-gray-600">
          Si ves un fondo degradado y esta tarjeta blanca, ¡Tailwind está funcionando!
        </p>
        <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-800 transition">
          Botón de prueba
        </button>
      </div>
    </div>
  );
}
