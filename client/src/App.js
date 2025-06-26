import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientDashboard from './pages/ClientDashboard';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import Users from './pages/Users';
import Clients from './pages/Clients';
import Fields from './pages/Fields';
import Flights from './pages/Flights';
import Evidence from './pages/Evidence';
import Settings from './pages/Settings';
import FieldDetail from './pages/FieldDetail';
import UserDetail from './pages/UserDetail';
import Notifications from './pages/Notifications';
import Map from './pages/Map';
import Support from './pages/Support';
import Reports from './pages/Reports';

function AppContent() {
  const { user, loading } = useAuth();

  // Mostrar spinner mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  // Función para determinar el dashboard según el rol
  const getDashboardComponent = () => {
    if (!user) return <Navigate to="/login" replace />;
    return user.role === 'CLIENT' ? <ClientDashboard /> : <Dashboard />;
  };

  return (
    <div className="App">
      <Routes>
        {/* Ruta pública */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        
        {/* Rutas protegidas */}
        <Route 
          path="/dashboard" 
          element={
            user ? (
              <Layout>
                {getDashboardComponent()}
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Rutas solo para administradores y operadores */}
        {user && user.role !== 'CLIENT' && (
          <>
            <Route
              path="/users"
              element={
                <Layout>
                  <Users />
                </Layout>
              }
            />
            <Route
              path="/clients"
              element={
                <Layout>
                  <Clients />
                </Layout>
              }
            />
            <Route
              path="/users/:id"
              element={
                <Layout>
                  <UserDetail />
                </Layout>
              }
            />
          </>
        )}

        {/* Rutas accesibles para todos los usuarios autenticados */}
        <Route
          path="/fields"
          element={
            user ? (
              <Layout>
                <Fields />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/flights"
          element={
            user ? (
              <Layout>
                <Flights />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/evidence"
          element={
            user ? (
              <Layout>
                <Evidence />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/settings"
          element={
            user ? (
              <Layout>
                <Settings />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/fields/:id"
          element={
            user ? (
              <Layout>
                <FieldDetail />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            user ? (
              <Layout>
                <Notifications />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/map"
          element={
            user ? (
              <Layout>
                <Map />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/support"
          element={
            user ? (
              <Layout>
                <Support />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/reports"
          element={
            user ? (
              <Layout>
                <Reports />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
        {/* Redirigir a dashboard si está autenticado, sino a login */}
        <Route 
          path="/" 
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
        />
        
        {/* Ruta 404 */}
        <Route 
          path="*" 
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 