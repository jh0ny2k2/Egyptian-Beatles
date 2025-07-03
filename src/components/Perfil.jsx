import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-lg font-bold">
              {user.nombre?.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <p className="text-lg text-gray-900">{user.nombre}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-lg text-gray-900">{user.email}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sesión iniciada</label>
              <p className="text-sm text-gray-600">
                {new Date(user.loginTime).toLocaleString('es-ES')}
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;