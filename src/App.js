// venta_inventario_app/frontend/src/App.js

import React, { useState } from 'react'; // <-- ¡CORRECCIÓN AQUÍ!
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ProductosList from './pages/productos/ProductosList';
import ProductoForm from './pages/productos/ProductoForm';
import ProductUploadPage from './pages/productos/ProductUploadPage'; // <-- Importar la nueva página
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterCompanyPage from './pages/RegisterCompanyPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import StockHistoryPage from './pages/StockHistoryPage';
import UserManagementPage from './pages/UserManagementPage';
import SalesPage from './pages/SalesPage';
import SalesHistoryPage from './pages/SalesHistoryPage';
import PrivateRoute from './components/PrivateRoute';
import InventoryReportPage from './pages/InventoryReportPage';
import DashboardPage from './pages/DashboardPage';
import ClientesPage from './pages/ClientesPage';
import ProveedoresPage from './pages/ProveedoresPage';

// Importamos los nuevos componentes
import Header from './components/Header';
import Sidebar from './components/Sidebar';

function AppContent() {
  const [refreshProducts, setRefreshProducts] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Nuevo estado para controlar si el sidebar está abierto o cerrado
  const { isAuthenticated } = useAuth();
  
  const handleProductCreated = () => {
    setRefreshProducts(prev => !prev);
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleEditComplete = () => {
    setProductToEdit(null);
    setRefreshProducts(prev => !prev);
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isAuthenticated) {
    return (
      <div className="App">
        <Header toggleSidebar={toggleSidebar} /> {/* Pasa la función aunque no se use en vista pública */}
        <main className="main-content-public">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register-company" element={<RegisterCompanyPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="App">
      <Header toggleSidebar={toggleSidebar} />
      <div className={`main-layout ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className="main-and-footer-container">
          <main className="main-content-private">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/productos" element={
                <PrivateRoute>
                  <div className="form-container">
                    <ProductoForm
                      onProductCreated={handleProductCreated}
                      productToEdit={productToEdit}
                      onEditComplete={handleEditComplete}
                    />
                  </div>
                  <hr style={{ margin: '30px 0' }} />
                  <div className="list-container">
                    <ProductosList
                      key={refreshProducts}
                      onEditClick={handleEditClick}
                    />
                  </div>
                </PrivateRoute>
              } />
              <Route path="/productos/upload" element={<PrivateRoute requiredRole="admin_compania"><ProductUploadPage /></PrivateRoute>} /> {/* <-- Nueva ruta */}
              <Route path="/historial-stock" element={<PrivateRoute><StockHistoryPage /></PrivateRoute>} />
              <Route path="/ventas" element={<PrivateRoute><SalesPage /></PrivateRoute>} />
              <Route path="/gestion-usuarios" element={<PrivateRoute requiredRole="admin_compania"><UserManagementPage /></PrivateRoute>} />
              <Route path="/historial-ventas" element={<PrivateRoute><SalesHistoryPage /></PrivateRoute>} />
              <Route path="/reporte-inventario" element={<PrivateRoute requiredRole="admin_compania"><InventoryReportPage /></PrivateRoute>} />
              <Route path="/clientes" element={<PrivateRoute><ClientesPage /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute requiredRole="admin_compania"><DashboardPage /></PrivateRoute>} />
              <Route path="/proveedores" element={<PrivateRoute><ProveedoresPage /></PrivateRoute>} />
              <Route path="*" element={<p>404: Página no encontrada</p>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
