import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión guardada al cargar la aplicación
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      try {
        const userData = JSON.parse(savedSession);
        setUser(userData);
      } catch (error) {
        console.error('Error al cargar sesión:', error);
        localStorage.removeItem('userSession');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userSession', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userSession');
  };

  const value = {
    user,
    login,
    logout,
    isLoggedIn: !!user,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};