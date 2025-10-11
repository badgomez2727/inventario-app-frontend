// src/components/Layout.js
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ children, toggleSidebar, isSidebarOpen, isMobile }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} isMobile={isMobile} toggleSidebar={toggleSidebar} />

      {/* Contenedor principal */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />

        {/* Contenido principal */}
        <main className="flex-1 p-6 pt-20 overflow-y-auto transition-all duration-300">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
