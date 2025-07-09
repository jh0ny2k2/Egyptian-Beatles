import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendPasswordResetEmail } from '../services/emailService';
import { supabase } from '../supabaseClient';
import bcrypt from 'bcryptjs';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.email === "" || formData.password === "") {
      setError("Por favor, completa todos los campos.");
      return;
    }
    
    setLoading(true);
    
    try {
      // Buscar el usuario en la base de datos
      const { data: users, error: fetchError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', formData.email)
        .limit(1);
      
      if (fetchError) {
        setError('Error al conectar con la base de datos');
        return;
      }
      
      if (users.length === 0) {
        setError('Usuario no encontrado');
        return;
      }
      
      const user = users[0];
      
      // Verificar la contraseña
      const passwordMatch = await bcrypt.compare(formData.password, user.password);
      
      if (!passwordMatch) {
        setError('Contraseña incorrecta');
        return;
      }
      
      // Login exitoso
      const userData = {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role || 'user',
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      };
      
      login(userData);
      
      alert('¡Bienvenido, ' + user.nombre + '!');
      navigate('/');
      
    } catch (err) {
      setError('Error al iniciar sesión');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMessage('');

    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetMessage('Por favor, ingresa un email válido.');
      setResetLoading(false);
      return;
    }

    const result = await sendPasswordResetEmail(resetEmail);
    setResetMessage(result.message);
    setResetLoading(false);

    if (result.success) {
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetEmail('');
        setResetMessage('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-2 sm:px-4">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center">
        <div className="bg-black rounded-full p-3 sm:p-4 mb-4">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-gray-900">
          {showForgotPassword ? 'Recuperar Contraseña' : 'Iniciar Sesión'}
        </h2>
        
        <p className="text-gray-500 mb-6 text-center text-sm sm:text-base">
          {showForgotPassword ? 'Ingresa tu email para recuperar tu contraseña' : 'Accede a tu cuenta'}
        </p>

        {!showForgotPassword ? (
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Correo electrónico</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-gray-50 text-sm sm:text-base"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                autoComplete="email"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">Contraseña</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-gray-50 text-sm sm:text-base"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                autoComplete="current-password"
              />
            </div>
            
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition mt-2 text-sm sm:text-base disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
            
            <div className="w-full flex flex-col items-center mt-4">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-gray-500 text-sm mb-2 hover:text-black transition"
              >
                ¿Olvidaste tu contraseña?
              </button>
              
              <span className="text-gray-500 text-sm mb-2">¿No tienes cuenta?</span>
              <Link
                to="/registro"
                className="w-full text-center bg-white border border-black text-black py-2 rounded-lg font-semibold hover:bg-black hover:text-white transition text-sm sm:text-base"
              >
                Crear cuenta
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4 w-full">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Correo electrónico</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-gray-50 text-sm sm:text-base"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {resetMessage && (
              <div className={`text-sm text-center ${
                resetMessage.includes('Error') ? 'text-red-500' : 'text-green-600'
              }`}>
                {resetMessage}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={resetLoading}
                className="flex-1 bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 text-sm sm:text-base"
              >
                {resetLoading ? 'Enviando...' : 'Enviar Enlace'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                  setResetMessage('');
                }}
                className="flex-1 bg-white border border-black text-black py-2 rounded-lg font-semibold hover:bg-black hover:text-white transition text-sm sm:text-base"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;