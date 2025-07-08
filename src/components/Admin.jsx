import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { Navigate } from 'react-router-dom';
import ProductManagement from './ProductManagement';

function Admin() {
  const { user, isLoggedIn } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Redireccionar si no es admin
  if (!isLoggedIn || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Panel de Administración</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar de navegación */}
            <div className="md:w-1/4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeSection === 'dashboard' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveSection('products')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeSection === 'products' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Productos
                </button>
                <button
                  onClick={() => setActiveSection('users')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeSection === 'users' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Usuarios
                </button>
                <button
                  onClick={() => setActiveSection('stats')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeSection === 'stats' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Estadísticas
                </button>
              </nav>
            </div>
            
            {/* Contenido principal */}
            <div className="md:w-3/4">
              {activeSection === 'dashboard' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Bienvenido al panel de administración</h2>
                  <p className="text-gray-600 mb-4">Desde aquí podrás gestionar todos los aspectos de la tienda.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Productos</h3>
                      <p className="text-gray-600 mb-4">Gestiona el catálogo de productos.</p>
                      <button 
                        onClick={() => setActiveSection('products')}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                      >
                        Gestionar Productos
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Usuarios</h3>
                      <p className="text-gray-600 mb-4">Administra usuarios y permisos.</p>
                      <button 
                        onClick={() => setActiveSection('users')}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                      >
                        Gestionar Usuarios
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Estadísticas</h3>
                      <p className="text-gray-600 mb-4">Ver estadísticas de ventas y visitas.</p>
                      <button 
                        onClick={() => setActiveSection('stats')}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                      >
                        Ver Estadísticas
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeSection === 'products' && <ProductManagement />}
              
              {activeSection === 'users' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Gestión de Usuarios</h2>
                  <p className="text-gray-600">Esta sección está en desarrollo.</p>
                </div>
              )}
              
              {activeSection === 'stats' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
                  <p className="text-gray-600">Esta sección está en desarrollo.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;