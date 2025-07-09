import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import bcrypt from 'bcryptjs';

function Perfil() {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('perfil');
  const [pedidos, setPedidos] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const fileInputRef = useRef(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [mostrarDetallesPedido, setMostrarDetallesPedido] = useState(false);
  const [comentariosPedido, setComentariosPedido] = useState([]);

  const verDetallesPedido = async (pedido) => {
    try {
      // Obtener los items del pedido
      const { data: items, error } = await supabase
        .from('pedido_items')
        .select('*')
        .eq('pedido_id', pedido.id);
      
      if (error) throw error;
      
      // Obtener los comentarios del pedido
      try {
        const { data: comentarios, error: errorComentarios } = await supabase
          .from('pedido_comentarios')
          .select('*')
          .eq('pedido_id', pedido.id)
          .order('created_at', { ascending: false });
        
        if (errorComentarios && !errorComentarios.message.includes('relation "pedido_comentarios" does not exist')) {
          throw errorComentarios;
        }
        
        setComentariosPedido(comentarios || []);
      } catch (comentarioError) {
        console.error('Error al cargar comentarios:', comentarioError);
        setComentariosPedido([]);
      }
      
      setPedidoSeleccionado({
        ...pedido,
        items: items || []
      });
      setMostrarDetallesPedido(true);
    } catch (error) {
      console.error('Error al cargar detalles del pedido:', error);
      setMensaje({ texto: 'Error al cargar los detalles del pedido', tipo: 'error' });
    }
  };

  const cerrarDetallesPedido = () => {
    setMostrarDetallesPedido(false);
    setPedidoSeleccionado(null);
    setComentariosPedido([]);
  };
  
  // Estados para edición de perfil
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    fechaNacimiento: user?.fechaNacimiento || ''
  });
  
  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Estado para preferencias
  const [preferencias, setPreferencias] = useState({
    correosPromocionales: false,
    notificacionesPedidos: true,
    idioma: 'es',
    moneda: 'eur'
  });

  // Estado para nueva dirección
  const [nuevaDireccion, setNuevaDireccion] = useState({
    nombre: '',
    calle: '',
    numero: '',
    ciudad: '',
    codigo_postal: '',
    provincia: '',
    telefono: ''
  });
  const [mostrarFormDireccion, setMostrarFormDireccion] = useState(false);
  const [editandoDireccion, setEditandoDireccion] = useState(null);

  // Estado para confirmación de eliminación de cuenta
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Cargar datos adicionales del usuario
  useEffect(() => {
    if (user) {
      // Cargar pedidos del usuario
      const fetchPedidos = async () => {
        try {
          const { data, error } = await supabase
            .from('pedidos')
            .select(`
              *,
              pedido_items (
                id,
                producto_id,
                nombre_producto,
                precio,
                cantidad,
                talla,
                color,
                imagen
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          setPedidos(data || []);
        } catch (error) {
          console.error('Error al cargar pedidos:', error);
        }
      };
      
      // Cargar direcciones del usuario
      const fetchDirecciones = async () => {
        try {
          const { data, error } = await supabase
            .from('direcciones')
            .select('*')
            .eq('user_id', user.id);
          
          if (error) throw error;
          setDirecciones(data || []);
        } catch (error) {
          console.error('Error al cargar direcciones:', error);
        }
      };

      // Cargar preferencias del usuario
      const fetchPreferencias = async () => {
        try {
          const { data, error } = await supabase
            .from('usuarios')
            .select('preferencias')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          if (data && data.preferencias) {
            setPreferencias(JSON.parse(data.preferencias) || preferencias);
          }
        } catch (error) {
          console.error('Error al cargar preferencias:', error);
        }
      };
      
      fetchPedidos();
      fetchDirecciones();
      fetchPreferencias();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenciasChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferencias(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDireccionChange = (e) => {
    const { name, value } = e.target;
    setNuevaDireccion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validar email
  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validar teléfono (formato español)
  const validarTelefono = (telefono) => {
    if (!telefono) return true; // Opcional
    const re = /^[6-9]\d{8}$/;
    return re.test(telefono);
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validaciones
      if (!validarEmail(formData.email)) {
        setMensaje({ texto: 'El formato del email no es válido', tipo: 'error' });
        setLoading(false);
        return;
      }

      if (formData.telefono && !validarTelefono(formData.telefono)) {
        setMensaje({ texto: 'El formato del teléfono no es válido (debe tener 9 dígitos y empezar por 6, 7, 8 o 9)', tipo: 'error' });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('usuarios')
        .update({
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          fechaNacimiento: formData.fechaNacimiento
        })
        .eq('id', user.id)
        .select();
      
      if (error) throw error;
      
      // Actualizar la sesión del usuario
      const updatedUserData = {
        ...user,
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento
      };
      
      login(updatedUserData);
      setEditando(false);
      setMensaje({ texto: 'Perfil actualizado correctamente', tipo: 'success' });
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setMensaje({ texto: 'Error al actualizar el perfil', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Verificar que las contraseñas nuevas coincidan
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setMensaje({ texto: 'Las contraseñas nuevas no coinciden', tipo: 'error' });
        setLoading(false);
        return;
      }

      // Verificar longitud mínima
      if (passwordData.newPassword.length < 6) {
        setMensaje({ texto: 'La contraseña debe tener al menos 6 caracteres', tipo: 'error' });
        setLoading(false);
        return;
      }
      
      // Obtener la contraseña actual del usuario
      const { data: userData, error: fetchError } = await supabase
        .from('usuarios')
        .select('password')
        .eq('id', user.id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Verificar la contraseña actual
      const passwordMatch = await bcrypt.compare(passwordData.currentPassword, userData.password);
      
      if (!passwordMatch) {
        setMensaje({ texto: 'La contraseña actual es incorrecta', tipo: 'error' });
        setLoading(false);
        return;
      }
      
      // Hashear la nueva contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(passwordData.newPassword, saltRounds);
      
      // Actualizar la contraseña
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ password: hashedPassword })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      // Limpiar el formulario
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setMensaje({ texto: 'Contraseña actualizada correctamente', tipo: 'success' });
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setMensaje({ texto: 'Error al cambiar la contraseña', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarPreferencias = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          preferencias: JSON.stringify(preferencias)
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setMensaje({ texto: 'Preferencias guardadas correctamente', tipo: 'success' });
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
      setMensaje({ texto: 'Error al guardar preferencias', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDireccion = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validaciones básicas
      if (!nuevaDireccion.nombre || !nuevaDireccion.calle || !nuevaDireccion.ciudad || !nuevaDireccion.codigo_postal) {
        setMensaje({ texto: 'Por favor, completa los campos obligatorios', tipo: 'error' });
        setLoading(false);
        return;
      }

      if (nuevaDireccion.telefono && !validarTelefono(nuevaDireccion.telefono)) {
        setMensaje({ texto: 'El formato del teléfono no es válido', tipo: 'error' });
        setLoading(false);
        return;
      }

      if (editandoDireccion) {
        // Actualizar dirección existente
        const { data, error } = await supabase
          .from('direcciones')
          .update({
            nombre: nuevaDireccion.nombre,
            calle: nuevaDireccion.calle,
            numero: nuevaDireccion.numero,
            ciudad: nuevaDireccion.ciudad,
            codigo_postal: nuevaDireccion.codigo_postal,
            provincia: nuevaDireccion.provincia,
            telefono: nuevaDireccion.telefono
          })
          .eq('id', editandoDireccion)
          .select();
        
        if (error) throw error;
        
        setDirecciones(prev => prev.map(dir => dir.id === editandoDireccion ? data[0] : dir));
        setMensaje({ texto: 'Dirección actualizada correctamente', tipo: 'success' });
      } else {
        // Añadir nueva dirección
        const { data, error } = await supabase
          .from('direcciones')
          .insert([{
            user_id: user.id,
            ...nuevaDireccion
          }])
          .select();
        
        if (error) throw error;
        
        setDirecciones(prev => [...prev, data[0]]);
        setMensaje({ texto: 'Dirección añadida correctamente', tipo: 'success' });
      }
      
      // Limpiar formulario y estado
      setNuevaDireccion({
        nombre: '',
        calle: '',
        numero: '',
        ciudad: '',
        codigo_postal: '',
        provincia: '',
        telefono: ''
      });
      setMostrarFormDireccion(false);
      setEditandoDireccion(null);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    } catch (error) {
      console.error('Error al gestionar dirección:', error);
      setMensaje({ texto: 'Error al gestionar dirección', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditarDireccion = (direccion) => {
    setNuevaDireccion({
      nombre: direccion.nombre,
      calle: direccion.calle,
      numero: direccion.numero,
      ciudad: direccion.ciudad,
      codigo_postal: direccion.codigo_postal,
      provincia: direccion.provincia,
      telefono: direccion.telefono
    });
    setEditandoDireccion(direccion.id);
    setMostrarFormDireccion(true);
  };

  const handleEliminarDireccion = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta dirección?')) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('direcciones')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setDirecciones(prev => prev.filter(dir => dir.id !== id));
      setMensaje({ texto: 'Dirección eliminada correctamente', tipo: 'success' });
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    } catch (error) {
      console.error('Error al eliminar dirección:', error);
      setMensaje({ texto: 'Error al eliminar dirección', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarCuenta = async () => {
    setLoading(true);
    
    try {
      // Eliminar direcciones del usuario
      const { error: errorDirecciones } = await supabase
        .from('direcciones')
        .delete()
        .eq('user_id', user.id);
      
      if (errorDirecciones) throw errorDirecciones;
      
      // Eliminar usuario
      const { error: errorUsuario } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', user.id);
      
      if (errorUsuario) throw errorUsuario;
      
      // Cerrar sesión
      logout();
      navigate('/');
      alert('Tu cuenta ha sido eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      setMensaje({ texto: 'Error al eliminar cuenta', tipo: 'error' });
      setMostrarConfirmacion(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar tipo de archivo
    const fileExt = file.name.split('.').pop();
    const allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
    if (!allowedExts.includes(fileExt.toLowerCase())) {
      setMensaje({ texto: 'Tipo de archivo no permitido. Sube una imagen (jpg, jpeg, png, gif)', tipo: 'error' });
      return;
    }
    
    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMensaje({ texto: 'La imagen es demasiado grande. Máximo 2MB', tipo: 'error' });
      return;
    }
    
    setLoading(true);
    
    try {
      // Subir archivo a Supabase Storage
      const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      // Obtener URL pública
      const { data: urlData } = await supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      const avatarUrl = urlData.publicUrl;
      
      // Actualizar perfil de usuario con la URL del avatar
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      // Actualizar sesión del usuario
      const updatedUserData = {
        ...user,
        avatar_url: avatarUrl
      };
      
      login(updatedUserData);
      setMensaje({ texto: 'Imagen de perfil actualizada correctamente', tipo: 'success' });
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      setMensaje({ texto: 'Error al subir imagen', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Cabecera del perfil */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div 
                className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user.nombre?.charAt(0).toUpperCase()
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.nombre}</h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
          
          {/* Mensaje de estado */}
          {mensaje.texto && (
            <div className={`p-3 rounded-lg mb-4 ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {mensaje.texto}
            </div>
          )}
          
          {/* Pestañas de navegación */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap sm:flex-nowrap overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('perfil')}
                className={`py-3 px-3 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${activeTab === 'perfil' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <span className="hidden sm:inline">Datos Personales</span>
                <span className="sm:hidden">Perfil</span>
              </button>
              <button
                onClick={() => setActiveTab('pedidos')}
                className={`py-3 px-3 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ml-4 sm:ml-8 ${activeTab === 'pedidos' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <span className="hidden sm:inline">Mis Pedidos</span>
                <span className="sm:hidden">Pedidos</span>
              </button>
              <button
                onClick={() => setActiveTab('direcciones')}
                className={`py-3 px-3 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ml-4 sm:ml-8 ${activeTab === 'direcciones' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Direcciones
              </button>
              <button
                onClick={() => setActiveTab('preferencias')}
                className={`py-3 px-3 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ml-4 sm:ml-8 ${activeTab === 'preferencias' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Preferencias
              </button>
              <button
                onClick={() => setActiveTab('seguridad')}
                className={`py-3 px-3 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ml-4 sm:ml-8 ${activeTab === 'seguridad' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Seguridad
              </button>
            </nav>
          </div>
        </div>
        
        {/* Contenido de las pestañas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Pestaña de Datos Personales */}
          {activeTab === 'perfil' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Datos Personales</h2>
                {!editando ? (
                  <button
                    onClick={() => setEditando(true)}
                    className="bg-black text-white py-1 px-3 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                  >
                    Editar
                  </button>
                ) : null}
              </div>
              
              {!editando ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <p className="text-lg text-gray-900 bg-gray-50 p-2 rounded-lg">{user.nombre}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-lg text-gray-900 bg-gray-50 p-2 rounded-lg">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <p className="text-lg text-gray-900 bg-gray-50 p-2 rounded-lg">{user.telefono || 'No especificado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
                      <p className="text-lg text-gray-900 bg-gray-50 p-2 rounded-lg">{user.fechaNacimiento || 'No especificada'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sesión iniciada</label>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                      {new Date(user.loginTime).toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Ej: 612345678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
                      <input
                        type="date"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditando(false)}
                      className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
          
          {/* Pestaña de Pedidos */}
          {activeTab === 'pedidos' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Mis Pedidos</h2>
              
              {pedidos.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="mt-4 text-gray-600">No tienes pedidos realizados todavía</p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-4 bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Ir a comprar
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {pedidos.map((pedido) => (
                    <div key={pedido.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Pedido #{pedido.id}</p>
                          <p className="text-sm text-gray-600">{new Date(pedido.created_at).toLocaleDateString('es-ES')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${pedido.total.toFixed(2)}</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${pedido.estado === 'completado' ? 'bg-green-100 text-green-800' : pedido.estado === 'enviado' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600">{pedido.pedido_items?.length || 0} productos</p>
                        <button 
                        onClick={() => verDetallesPedido(pedido)}
                        className="text-sm text-black underline mt-1 hover:text-gray-600 transition-colors"
                      >
                        Ver detalles
                      </button>
                      </div>
                    </div>
                  ))}
                </div>

                
              )}

              {/* Modal de detalles del pedido */}
              {mostrarDetallesPedido && pedidoSeleccionado && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header del modal */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Detalles del Pedido #{pedidoSeleccionado.id}</h2>
                      <button
                        onClick={cerrarDetallesPedido}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                      >
                        ×
                      </button>
                    </div>
                    
                    {/* Contenido del modal */}
                    <div className="p-6 space-y-6">
                      {/* Información general del pedido */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold border-b pb-2">Información del Pedido</h3>
                          <div className="space-y-2">
                            <p><span className="font-medium">Fecha:</span> {new Date(pedidoSeleccionado.created_at).toLocaleDateString('es-ES', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</p>
                            <p><span className="font-medium">Estado:</span> 
                              <span className={`ml-2 inline-block px-2 py-1 text-xs rounded-full ${
                                pedidoSeleccionado.estado === 'completado' ? 'bg-green-100 text-green-800' : 
                                pedidoSeleccionado.estado === 'enviado' ? 'bg-blue-100 text-blue-800' : 
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {pedidoSeleccionado.estado.charAt(0).toUpperCase() + pedidoSeleccionado.estado.slice(1)}
                              </span>
                            </p>
                            <p><span className="font-medium">Método de pago:</span> {pedidoSeleccionado.metodo_pago || 'Tarjeta'}</p>
                            <p><span className="font-medium">Tipo de envío:</span> {pedidoSeleccionado.tipo_envio || 'Estándar'}</p>
                            {pedidoSeleccionado.telefono_contacto && (
                              <p><span className="font-medium">Teléfono:</span> {pedidoSeleccionado.telefono_contacto}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold border-b pb-2">Dirección de Envío</h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm">{pedidoSeleccionado.direccion_envio || 'No especificada'}</p>
                          </div>
                          
                          {pedidoSeleccionado.notas && (
                            <div>
                              <h4 className="font-medium mb-2">Notas del pedido:</h4>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm">{pedidoSeleccionado.notas}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Productos del pedido */}
                      <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Productos ({pedidoSeleccionado.items.length})</h3>
                        <div className="space-y-4">
                          {pedidoSeleccionado.items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                              {item.imagen && (
                                <img 
                                  src={item.imagen} 
                                  alt={item.nombre_producto}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="font-medium">{item.nombre_producto}</h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                  {item.talla && <p>Talla: {item.talla}</p>}
                                  {item.color && <p>Color: {item.color}</p>}
                                  <p>Cantidad: {item.cantidad}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${(item.precio * item.cantidad).toFixed(2)}</p>
                                <p className="text-sm text-gray-600">${item.precio.toFixed(2)} c/u</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Sección de comentarios y seguimiento */}
                      {comentariosPedido.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold mb-4 text-lg">Seguimiento del Pedido</h4>
                          <div className="space-y-4">
                            {comentariosPedido.map((comentario, index) => (
                              <div key={index} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg">
                                <div className="flex justify-between items-start mb-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    comentario.tipo === 'cambio_estado' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {comentario.tipo === 'cambio_estado' ? 'Actualización de Estado' : 'Comentario'}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {new Date(comentario.created_at).toLocaleString('es-ES', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                {comentario.tipo === 'cambio_estado' && comentario.estado_anterior && comentario.estado_nuevo && (
                                  <div className="mb-2">
                                    <span className="text-sm text-gray-600">
                                      Estado cambiado de 
                                      <span className="font-semibold text-gray-800"> {comentario.estado_anterior} </span>
                                      a 
                                      <span className="font-semibold text-gray-800"> {comentario.estado_nuevo}</span>
                                    </span>
                                  </div>
                                )}
                                <p className="text-gray-800 leading-relaxed">{comentario.comentario}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Mensaje cuando no hay comentarios */}
                      {comentariosPedido.length === 0 && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                          <p className="text-gray-600">
                            <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.697-.413l-2.725.725a1 1 0 01-1.265-1.265l.725-2.725A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                            </svg>
                            No hay actualizaciones disponibles para este pedido.
                          </p>
                        </div>
                      )}

                      {/* Resumen de costos */}
                      <div className="border-t pt-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>${(pedidoSeleccionado.total - (pedidoSeleccionado.costo_envio || 0)).toFixed(2)}</span>
                            </div>
                            {pedidoSeleccionado.costo_envio > 0 && (
                              <div className="flex justify-between">
                                <span>Envío:</span>
                                <span>${pedidoSeleccionado.costo_envio.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                              <span>Total:</span>
                              <span>${pedidoSeleccionado.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer del modal */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end">
                      <button
                        onClick={cerrarDetallesPedido}
                        className="bg-black text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Pestaña de Direcciones */}
          {activeTab === 'direcciones' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Mis Direcciones</h2>
              
              {/* Formulario para añadir/editar dirección */}
              {mostrarFormDireccion && (
                <div className="border border-gray-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium mb-4">{editandoDireccion ? 'Editar dirección' : 'Añadir nueva dirección'}</h3>
                  <form onSubmit={handleSubmitDireccion} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la dirección*</label>
                        <input
                          type="text"
                          name="nombre"
                          value={nuevaDireccion.nombre}
                          onChange={handleDireccionChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="Ej: Casa, Trabajo"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de contacto</label>
                        <input
                          type="tel"
                          name="telefono"
                          value={nuevaDireccion.telefono}
                          onChange={handleDireccionChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="Ej: 612345678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Calle*</label>
                        <input
                          type="text"
                          name="calle"
                          value={nuevaDireccion.calle}
                          onChange={handleDireccionChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                        <input
                          type="text"
                          name="numero"
                          value={nuevaDireccion.numero}
                          onChange={handleDireccionChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad*</label>
                        <input
                          type="text"
                          name="ciudad"
                          value={nuevaDireccion.ciudad}
                          onChange={handleDireccionChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Código postal*</label>
                        <input
                          type="text"
                          name="codigo_postal"
                          value={nuevaDireccion.codigo_postal}
                          onChange={handleDireccionChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
                        <input
                          type="text"
                          name="provincia"
                          value={nuevaDireccion.provincia}
                          onChange={handleDireccionChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMostrarFormDireccion(false);
                          setEditandoDireccion(null);
                          setNuevaDireccion({
                            nombre: '',
                            calle: '',
                            numero: '',
                            ciudad: '',
                            codigo_postal: '',
                            provincia: '',
                            telefono: ''
                          });
                        }}
                        className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Guardando...' : editandoDireccion ? 'Actualizar dirección' : 'Añadir dirección'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {!mostrarFormDireccion && direcciones.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="mt-4 text-gray-600">No tienes direcciones guardadas</p>
                  <button
                    onClick={() => setMostrarFormDireccion(true)}
                    className="mt-4 bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Añadir dirección
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {direcciones.map((direccion) => (
                    <div key={direccion.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{direccion.nombre}</p>
                          <p className="text-gray-600">{direccion.calle}, {direccion.numero}</p>
                          <p className="text-gray-600">{direccion.ciudad}, {direccion.codigo_postal}</p>
                          <p className="text-gray-600">{direccion.provincia}</p>
                          <p className="text-gray-600">{direccion.telefono}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            className="text-gray-500 hover:text-black"
                            onClick={() => handleEditarDireccion(direccion)}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button 
                            className="text-gray-500 hover:text-red-500"
                            onClick={() => handleEliminarDireccion(direccion.id)}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {!mostrarFormDireccion && (
                    <button
                      onClick={() => setMostrarFormDireccion(true)}
                      className="w-full border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center text-gray-500 hover:text-black hover:border-black transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Añadir nueva dirección
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Pestaña de Preferencias */}
          {activeTab === 'preferencias' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Preferencias</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Notificaciones</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Correos promocionales</p>
                        <p className="text-sm text-gray-600">Recibe ofertas y novedades</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          name="correosPromocionales"
                          checked={preferencias.correosPromocionales}
                          onChange={handlePreferenciasChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notificaciones de pedidos</p>
                        <p className="text-sm text-gray-600">Actualizaciones sobre tus compras</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          name="notificacionesPedidos"
                          checked={preferencias.notificacionesPedidos}
                          onChange={handlePreferenciasChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Idioma y moneda</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        name="idioma"
                        value={preferencias.idioma}
                        onChange={handlePreferenciasChange}
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        name="moneda"
                        value={preferencias.moneda}
                        onChange={handlePreferenciasChange}
                      >
                        <option value="eur">EUR (€)</option>
                        <option value="usd">USD ($)</option>
                        <option value="gbp">GBP (£)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleGuardarPreferencias}
                    disabled={loading}
                    className="bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : 'Guardar preferencias'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Pestaña de Seguridad */}
          {activeTab === 'seguridad' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Seguridad</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Cambiar contraseña</h3>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                        minLength={6}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Cambiando...' : 'Cambiar contraseña'}
                    </button>
                  </form>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium mb-3">Eliminar cuenta</h3>
                  <p className="text-gray-600 mb-4">Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos.</p>
                  
                  {!mostrarConfirmacion ? (
                    <button
                      onClick={() => setMostrarConfirmacion(true)}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      Eliminar mi cuenta
                    </button>
                  ) : (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-red-600 font-medium mb-3">¿Estás seguro de que deseas eliminar tu cuenta?</p>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setMostrarConfirmacion(false)}
                          className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleEliminarCuenta}
                          disabled={loading}
                          className="bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {loading ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Perfil;