import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ children, toggleSidebar, isSidebarOpen, isMobile }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      
      {/* Sidebar - Asegúrate que en Sidebar.jsx tenga h-full */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        isMobile={isMobile} 
        toggleSidebar={toggleSidebar} 
      />

      <div className="flex flex-col flex-1 min-w-0">
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />

        {/* flex-1 asegura que el contenido crezca.
           min-h-screen junto con el flex-col del padre 
           ayudará a empujar el footer al fondo.
        */}
        <main className="flex-1 p-4 md:p-8 pt-24 md:pt-28">
          <div className="max-w-7xl mx-auto w-full min-h-[70vh]">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}