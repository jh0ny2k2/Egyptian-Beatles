import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import bcrypt from "bcryptjs";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    // Validar longitud mínima de contraseña
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      // Hashear la contraseña antes de guardarla
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Insertar en la tabla usuarios con contraseña hasheada
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{ 
          nombre: nombre,
          email: email,
          password: hashedPassword,
          role: 'user' // Añadimos el rol por defecto
        }])
        .select();
      
      if (error) {
        setError(error.message);
      } else {
        // Guardar información del usuario en localStorage para mantener la sesión
        const userData = {
          id: data[0].id,
          nombre: data[0].nombre,
          email: data[0].email,
          isLoggedIn: true,
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('userSession', JSON.stringify(userData));
        
        alert('Usuario registrado correctamente. Sesión iniciada.');
        // Redirigir a la página principal
        navigate('/');
      }
    } catch (err) {
      setError('Error al registrar usuario');
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
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-gray-900">Crear cuenta</h2>
        <p className="text-gray-500 mb-6 text-center text-sm sm:text-base">Regístrate para disfrutar de todas las ventajas</p>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nombre</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-gray-50 text-sm sm:text-base"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
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
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Repite la contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-gray-50 text-sm sm:text-base"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition mt-2 text-sm sm:text-base disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>
        <div className="w-full flex flex-col items-center mt-6">
          <span className="text-gray-500 text-sm mb-2">¿Ya tienes cuenta?</span>
          <Link
            to="/login"
            className="w-full text-center bg-white border border-black text-black py-2 rounded-lg font-semibold hover:bg-black hover:text-white transition text-sm sm:text-base"
          >
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Registro;