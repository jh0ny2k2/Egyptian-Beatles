import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseClient';


function Checkout() {
  const { user, isLoggedIn } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [direccionesUsuario, setDireccionesUsuario] = useState([]);
  const [productsWithStock, setProductsWithStock] = useState({});
  
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    // Datos de envío
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    direccion: {
      calle: '',
      numero: '',
      ciudad: '',
      codigo_postal: '',
      provincia: ''
    },
    // Método de pago
    metodoPago: 'tarjeta',
    // Datos de tarjeta (simulado)
    tarjeta: {
      numero: '',
      nombre: '',
      expiracion: '',
      cvv: ''
    },
    // Opciones de envío
    tipoEnvio: 'estandar',
    notas: ''
  });
  
  // Cargar direcciones del usuario y stock de productos
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    if (cartItems.length === 0) {
      navigate('/');
      return;
    }
    
    fetchDirecciones();
    loadProductsStock();
  }, [isLoggedIn, cartItems]);
  
  const fetchDirecciones = async () => {
    try {
      const { data, error } = await supabase
        .from('direcciones')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setDireccionesUsuario(data || []);
    } catch (error) {
      console.error('Error al cargar direcciones:', error);
    }
  };
  
  const loadProductsStock = async () => {
    try {
      const productIds = [...new Set(cartItems.map(item => item.id))];
      if (productIds.length === 0) return;
      
      const { data, error } = await supabase
        .from('productos')
        .select('id, stock_por_talla')
        .in('id', productIds);
        
      if (error) throw error;
      
      const stockMap = {};
      data.forEach(product => {
        stockMap[product.id] = product;
      });
      
      setProductsWithStock(stockMap);
    } catch (error) {
      console.error('Error al cargar stock:', error);
    }
  };
  
  // Validar stock antes de proceder
  const validateStock = () => {
    for (const item of cartItems) {
      if (item.selectedSize) {
        const product = productsWithStock[item.id];
        if (!product || !product.stock_por_talla) {
          setError(`No se pudo verificar el stock para ${item.name}`);
          return false;
        }
        
        try {
          const stockData = typeof product.stock_por_talla === 'string' 
            ? JSON.parse(product.stock_por_talla) 
            : product.stock_por_talla;
          
          const availableStock = stockData[item.selectedSize] || 0;
          
          if (availableStock < item.quantity) {
            setError(`Stock insuficiente para ${item.name} talla ${item.selectedSize}. Disponible: ${availableStock}`);
            return false;
          }
        } catch (error) {
          setError(`Error al verificar stock para ${item.name}`);
          return false;
        }
      }
    }
    return true;
  };
  
  // Calcular costos
  const subtotal = getCartTotal();
  const costoEnvio = formData.tipoEnvio === 'express' ? 7.99 : (subtotal >= 60 ? 0 : 3.99);
  const total = subtotal + costoEnvio;
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('direccion.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        direccion: {
          ...prev.direccion,
          [field]: value
        }
      }));
    } else if (name.startsWith('tarjeta.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        tarjeta: {
          ...prev.tarjeta,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const seleccionarDireccion = (direccion) => {
    setFormData(prev => ({
      ...prev,
      direccion: {
        calle: direccion.calle,
        numero: direccion.numero,
        ciudad: direccion.ciudad,
        codigo_postal: direccion.codigo_postal,
        provincia: direccion.provincia
      }
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validar stock
      if (!validateStock()) {
        setLoading(false);
        return;
      }
      
      // Crear pedido
      const pedidoData = {
        user_id: user.id,
        total: total,
        estado: 'pendiente',
        direccion_envio: `${formData.direccion.calle}, ${formData.direccion.numero}, ${formData.direccion.ciudad}, ${formData.direccion.codigo_postal}, ${formData.direccion.provincia}`,
        metodo_pago: formData.metodoPago,
        tipo_envio: formData.tipoEnvio,
        costo_envio: costoEnvio,
        notas: formData.notas,
        telefono_contacto: formData.telefono
      };
      
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert([pedidoData])
        .select()
        .single();
      
      if (pedidoError) throw pedidoError;
      
      // Crear items del pedido
      const pedidoItems = cartItems.map(item => ({
        pedido_id: pedido.id,
        producto_id: item.id,
        nombre_producto: item.name,
        precio: item.price,
        cantidad: item.quantity,
        talla: item.selectedSize || null,
        color: item.selectedColor || null,
        imagen: item.image
      }));
      
      const { error: itemsError } = await supabase
        .from('pedido_items')
        .insert(pedidoItems);
      
      if (itemsError) throw itemsError;
      
      // Actualizar stock
      for (const item of cartItems) {
        if (item.selectedSize) {
          const product = productsWithStock[item.id];
          const stockData = typeof product.stock_por_talla === 'string' 
            ? JSON.parse(product.stock_por_talla) 
            : product.stock_por_talla;
          
          stockData[item.selectedSize] = (stockData[item.selectedSize] || 0) - item.quantity;
          
          const { error: stockError } = await supabase
            .from('productos')
            .update({ stock_por_talla: JSON.stringify(stockData) })
            .eq('id', item.id);
          
          if (stockError) throw stockError;
        }
      }
      
      // Limpiar carrito
      clearCart();
      
      setSuccess('¡Pedido realizado con éxito!');
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/perfil?tab=pedidos');
      }, 3000);
      
    } catch (error) {
      console.error('Error al procesar pedido:', error);
      setError('Error al procesar el pedido. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isLoggedIn) {
    return null;
  }
  
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido Confirmado!</h2>
          <p className="text-gray-600 mb-4">{success}</p>
          <p className="text-sm text-gray-500">Serás redirigido a tus pedidos en unos segundos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">
                  Inicio
                </button>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <span className="text-gray-900 font-medium">Checkout</span>
              </li>
            </ol>
          </nav>
        </div>
        
        {/* Indicador de pasos */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-black text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Envío</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-black text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Pago</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 3 ? 'bg-black' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${currentStep >= 3 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-black text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-2 font-medium">Confirmación</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario principal */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Paso 1: Información de envío */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6">Información de Envío</h2>
                  
                  {/* Direcciones guardadas */}
                  {direccionesUsuario.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Direcciones guardadas</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {direccionesUsuario.map((direccion) => (
                          <button
                            key={direccion.id}
                            type="button"
                            onClick={() => seleccionarDireccion(direccion)}
                            className="text-left p-3 border border-gray-200 rounded-lg hover:border-black transition-colors"
                          >
                            <p className="font-medium">{direccion.nombre}</p>
                            <p className="text-sm text-gray-600">{direccion.calle}, {direccion.numero}</p>
                            <p className="text-sm text-gray-600">{direccion.ciudad}, {direccion.codigo_postal}</p>
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 border-t pt-4">
                        <p className="text-sm text-gray-600 mb-3">O introduce una nueva dirección:</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo*</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono*</label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Calle*</label>
                      <input
                        type="text"
                        name="direccion.calle"
                        value={formData.direccion.calle}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                      <input
                        type="text"
                        name="direccion.numero"
                        value={formData.direccion.numero}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad*</label>
                      <input
                        type="text"
                        name="direccion.ciudad"
                        value={formData.direccion.ciudad}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Código postal*</label>
                      <input
                        type="text"
                        name="direccion.codigo_postal"
                        value={formData.direccion.codigo_postal}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
                      <input
                        type="text"
                        name="direccion.provincia"
                        value={formData.direccion.provincia}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                  
                  {/* Opciones de envío */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Opciones de envío</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-black">
                        <input
                          type="radio"
                          name="tipoEnvio"
                          value="estandar"
                          checked={formData.tipoEnvio === 'estandar'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-medium">Envío estándar (2-5 días laborables)</p>
                          <p className="text-sm text-gray-600">{subtotal >= 60 ? 'Gratis' : '3,99€'}</p>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-black">
                        <input
                          type="radio"
                          name="tipoEnvio"
                          value="express"
                          checked={formData.tipoEnvio === 'express'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-medium">Envío exprés (24-48h)</p>
                          <p className="text-sm text-gray-600">7,99€</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notas del pedido (opcional)</label>
                    <textarea
                      name="notas"
                      value={formData.notas}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Instrucciones especiales para la entrega..."
                    />
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="bg-black text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                      Continuar al pago
                    </button>
                  </div>
                </div>
              )}
              
              {/* Paso 2: Información de pago */}
              {currentStep === 2 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6">Información de Pago</h2>
                  
                  {/* Métodos de pago */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Método de pago</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-black">
                        <input
                          type="radio"
                          name="metodoPago"
                          value="tarjeta"
                          checked={formData.metodoPago === 'tarjeta'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-medium">Tarjeta de crédito/débito</p>
                          <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-black">
                        <input
                          type="radio"
                          name="metodoPago"
                          value="paypal"
                          checked={formData.metodoPago === 'paypal'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-medium">PayPal</p>
                          <p className="text-sm text-gray-600">Paga con tu cuenta de PayPal</p>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-black">
                        <input
                          type="radio"
                          name="metodoPago"
                          value="transferencia"
                          checked={formData.metodoPago === 'transferencia'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-medium">Transferencia bancaria</p>
                          <p className="text-sm text-gray-600">Recibirás los datos por email</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Datos de tarjeta (solo si se selecciona tarjeta) */}
                  {formData.metodoPago === 'tarjeta' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta*</label>
                        <input
                          type="text"
                          name="tarjeta.numero"
                          value={formData.tarjeta.numero}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="1234 5678 9012 3456"
                          required={formData.metodoPago === 'tarjeta'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre en la tarjeta*</label>
                        <input
                          type="text"
                          name="tarjeta.nombre"
                          value={formData.tarjeta.nombre}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          required={formData.metodoPago === 'tarjeta'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de expiración*</label>
                        <input
                          type="text"
                          name="tarjeta.expiracion"
                          value={formData.tarjeta.expiracion}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="MM/AA"
                          required={formData.metodoPago === 'tarjeta'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV*</label>
                        <input
                          type="text"
                          name="tarjeta.cvv"
                          value={formData.tarjeta.cvv}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="123"
                          required={formData.metodoPago === 'tarjeta'}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="bg-black text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                      Revisar pedido
                    </button>
                  </div>
                </div>
              )}
              
              {/* Paso 3: Confirmación */}
              {currentStep === 3 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6">Confirmar Pedido</h2>
                  
                  {/* Resumen de envío */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Dirección de envío</h3>
                    <p className="text-sm text-gray-600">
                      {formData.nombre}<br/>
                      {formData.direccion.calle}, {formData.direccion.numero}<br/>
                      {formData.direccion.ciudad}, {formData.direccion.codigo_postal}<br/>
                      {formData.direccion.provincia}<br/>
                      Tel: {formData.telefono}
                    </p>
                  </div>
                  
                  {/* Resumen de pago */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Método de pago</h3>
                    <p className="text-sm text-gray-600">
                      {formData.metodoPago === 'tarjeta' && 'Tarjeta de crédito/débito'}
                      {formData.metodoPago === 'paypal' && 'PayPal'}
                      {formData.metodoPago === 'transferencia' && 'Transferencia bancaria'}
                    </p>
                  </div>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
                      {error}
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-black text-white py-3 px-8 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Procesando...' : 'Confirmar pedido'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
          
          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Resumen del pedido</h3>
              
              {/* Items del carrito */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center space-x-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      {item.selectedSize && (
                        <p className="text-xs text-gray-600">Talla: {item.selectedSize}</p>
                      )}
                      {item.selectedColor && (
                        <p className="text-xs text-gray-600">Color: {item.selectedColor}</p>
                      )}
                      <p className="text-xs text-gray-600">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              {/* Totales */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>{costoEnvio === 0 ? 'Gratis' : `$${costoEnvio.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Información adicional */}
              <div className="mt-6 text-xs text-gray-600 space-y-1">
                <p>• Envío gratis en pedidos superiores a 60€</p>
                <p>• Devoluciones gratuitas en 30 días</p>
                <p>• Pago 100% seguro</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;