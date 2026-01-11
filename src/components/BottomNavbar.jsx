import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BottomNavbar from './BottomNavbar';

export default function Layout({ children, toggleSidebar, isSidebarOpen, isMobile }) {
  return (
    // min-h-screen asegura que ocupe todo el alto, overflow-hidden evita doble scroll
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      
      {/* 1. SIDEBAR: Ahora es parte del flujo horizontal */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        isMobile={isMobile} 
        toggleSidebar={toggleSidebar} 
      />

      {/* 2. CONTENEDOR DERECHO: Header + Contenido + Footer */}
      <div className="flex flex-col flex-1 min-w-0 relative">
        
        {/* HEADER: Fijo arriba */}
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />

        {/* 3. ÁREA DE SCROLL: Aquí es donde vive el contenido */}
        <main className="flex-1 overflow-y-auto pt-20 flex flex-col custom-scrollbar">
          
          {/* Contenedor del contenido real */}
          <div className="flex-1 p-4 md:p-8">
            <div className="max-w-7xl mx-auto w-full animate-fadeIn">
              {children}
            </div>
          </div>

          {/* FOOTER: Dentro del scroll para que aparezca al final del contenido, 
              pero con mt-auto para que si hay poco contenido, se pegue abajo */}
          <div className="mt-auto">
             <Footer />
          </div>

          {/* Espaciador para no tapar contenido con el BottomNavbar en móvil */}
          <div className="h-20 md:hidden"></div>
        </main>

        {/* NAVBAR MÓVIL: Solo visible en pantallas pequeñas */}
        <BottomNavbar />
      </div>

      {/* Estilos para limpiar el scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}