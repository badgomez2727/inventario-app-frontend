// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Páginas
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterCompanyPage from './pages/RegisterCompanyPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProductosList from './pages/productos/ProductosList';
import ProductoForm from './pages/productos/ProductoForm';
import ProductUploadPage from './pages/productos/ProductUploadPage';
import StockHistoryPage from './pages/StockHistoryPage';
import SalesPage from './pages/SalesPage';
import WhatsappOrderPage from './pages/WhatsappOrderPage';
import SalesHistoryPage from './pages/SalesHistoryPage';
import InventoryReportPage from './pages/InventoryReportPage';
import DashboardPage from './pages/DashboardPage';
import ClientesPage from './pages/ClientesPage';
import ProveedoresPage from './pages/ProveedoresPage';
import UserManagementPage from './pages/UserManagementPage';
import AdminCompaniesPage from './pages/AdminCompaniesPage';
import SupportPage from './pages/SupportPage';
import TermsPage from './pages/TermsPage';

// Componentes
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import BottomNavbar from './components/BottomNavbar';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [refreshProducts, setRefreshProducts] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // 🔹 Detectar cambio de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const handleProductCreated = () => setRefreshProducts(prev => !prev);
  const handleEditClick = (product) => setProductToEdit(product);
  const handleEditComplete = () => {
    setProductToEdit(null);
    setRefreshProducts(prev => !prev);
  };

  // 🔹 Rutas públicas (sin autenticación)
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-company" element={<RegisterCompanyPage />} />
          <Route path="/apoyar" element={<SupportPage />} />
          <Route path="/terminos" element={<TermsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
        {/* Nota: Quité el Footer de aquí porque tu Landing ya tiene uno propio */}
      </div>
    );
  }

  // 🔹 Rutas privadas (con autenticación)
  return (
    <>
      <Layout toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} isMobile={isMobile}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route
            path="/productos"
            element={
              <PrivateRoute>
                <div className="space-y-6">
                  <ProductoForm
                    onProductCreated={handleProductCreated}
                    productToEdit={productToEdit}
                    onEditComplete={handleEditComplete}
                  />
                  <ProductosList
                    key={refreshProducts}
                    onEditClick={handleEditClick}
                  />
                </div>
              </PrivateRoute>
            }
          />

          <Route path="/productos/upload" element={<PrivateRoute requiredRole="admin_compania"><ProductUploadPage /></PrivateRoute>} />
          <Route path="/historial-stock" element={<PrivateRoute><StockHistoryPage /></PrivateRoute>} />
          <Route path="/ventas" element={<PrivateRoute><SalesPage /></PrivateRoute>} />
          <Route path="/pedido-whatsapp" element={<PrivateRoute><WhatsappOrderPage /></PrivateRoute>} />
          <Route path="/historial-ventas" element={<PrivateRoute><SalesHistoryPage /></PrivateRoute>} />
          <Route path="/reporte-inventario" element={<PrivateRoute requiredRole="admin_compania"><InventoryReportPage /></PrivateRoute>} />
          <Route path="/clientes" element={<PrivateRoute><ClientesPage /></PrivateRoute>} />
          <Route path="/proveedores" element={<PrivateRoute><ProveedoresPage /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/gestion-usuarios" element={<PrivateRoute requiredRole="admin_compania"><UserManagementPage /></PrivateRoute>} />
          <Route path="/admin/companias" element={<PrivateRoute requiredRole="super_admin_sistema"><AdminCompaniesPage /></PrivateRoute>} />
          <Route path="/apoyar" element={<PrivateRoute><SupportPage /></PrivateRoute>} />
          <Route path="/terminos" element={<PrivateRoute><TermsPage /></PrivateRoute>} />
          <Route path="*" element={<p className="text-center text-red-500 font-semibold">404: Página no encontrada</p>} />
          
        </Routes>
      </Layout>

      {isAuthenticated && isMobile && <BottomNavbar />}
    </>
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
