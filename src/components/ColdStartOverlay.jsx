import React, { useEffect, useState } from 'react';

// Backend (Render free) y base de datos (Neon free) se "duermen" tras un
// rato sin uso. apiService dispara el evento 'vendita:coldstart' cuando una
// petición se demora más de lo normal — este overlay lo escucha y avisa al
// usuario que es normal, en vez de dejarlo pensando que algo se dañó.
function ColdStartOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => setVisible(e.detail);
    window.addEventListener('vendita:coldstart', handler);
    return () => window.removeEventListener('vendita:coldstart', handler);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="text-center px-6 max-w-xs">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-700 font-black">Despertando el servidor...</p>
        <p className="text-xs text-gray-400 mt-2">
          Puede tardar hasta 30-40 segundos si nadie ha usado la app en un rato. No cierres ni recargues, ya casi está.
        </p>
      </div>
    </div>
  );
}

export default ColdStartOverlay;
