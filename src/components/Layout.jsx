import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BottomNavbar from './BottomNavbar';

export default function Layout({ children, toggleSidebar, isSidebarOpen, isMobile }) {
  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc]">
      
      {/* Sidebar fijo solo en escritorio para no romper el flujo */}
      <div className="hidden md:block">
        <Sidebar 
          isSidebarOpen={isSidebarOpen} 
          isMobile={isMobile} 
          toggleSidebar={toggleSidebar} 
        />
      </div>

      {/* Sidebar móvil (solo se ve cuando se activa) */}
      <div className="md:hidden">
        <Sidebar 
          isSidebarOpen={isSidebarOpen} 
          isMobile={isMobile} 
          toggleSidebar={toggleSidebar} 
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0 w-full">
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />

        {/* Quitamos el h-screen del padre y dejamos que el main fluya 
            pero le ponemos un fondo que cubra el lateral */}
        <main className="flex-1 pt-24 md:pt-28 pb-20 md:pb-0">
          <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-[calc(100vh-200px)]">
            {children}
          </div>
          <Footer />
        </main>

        <BottomNavbar />
      </div>
    </div>
  );
}