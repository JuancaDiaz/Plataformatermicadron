import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

// Contexto de autenticación
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un token guardado al cargar la app
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  // Verificar el estado de autenticación
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authService.getCurrentUser();
      setUser(response.user);
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      // Si hay error, limpiar token y usuario
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Función de login
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { user, token } = response;
      
      // Guardar token en localStorage
      localStorage.setItem('token', token);
      
      // Actualizar estado del usuario
      setUser(user);
      
      toast.success(`Bienvenido, ${user.firstName}!`);
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Sesión cerrada exitosamente');
  };

  // Función para registrar usuario (solo admin)
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      toast.success('Usuario creado exitosamente');
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Error en registro:', error);
      const message = error.response?.data?.message || 'Error al crear usuario';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 