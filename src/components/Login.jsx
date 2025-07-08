import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import bcrypt from "bcryptjs";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (email === "" || password === "") {
      setError("Por favor, completa todos los campos.");
      return;
    }
    
    setLoading(true);
    
    try {
      // Buscar el usuario en la base de datos
      const { data: users, error: fetchError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
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
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        setError('Contraseña incorrecta');
        return;
      }
      
      // Login exitoso
      const userData = {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role || 'user', // Añadimos el rol, con valor por defecto 'user'
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      };
      
      // Usar el contexto de autenticación para guardar la sesión
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-2 sm:px-4">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center">
        <div className="bg-black rounded-full p-3 sm:p-4 mb-4">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 4a3 3 0 110 6 3 3 0 010-6zm0 14c-2.67 0-5.067-1.337-6.447-3.356C5.06 15.065 7.377 14 12 14s6.94 1.065 6.447 2.644C17.067 18.663 14.67 20 12 20z" fill="currentColor"/>
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-gray-900">Iniciar sesión</h2>
        <p className="text-gray-500 mb-6 text-center text-sm sm:text-base">Accede a tu cuenta para continuar</p>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Correo electrónico</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-gray-50 text-sm sm:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-gray-50 text-sm sm:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </form>
        <div className="w-full flex flex-col items-center mt-6">
          <span className="text-gray-500 text-sm mb-2">¿Aún no tienes cuenta?</span>
          <Link
            to="/registro"
            className="w-full text-center bg-white border border-black text-black py-2 rounded-lg font-semibold hover:bg-black hover:text-white transition text-sm sm:text-base"
          >
            Crea una
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;