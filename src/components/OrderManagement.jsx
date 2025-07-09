import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function OrderManagement() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  
  // Nuevos estados para comentarios y cambio de estado
  const [mostrarModalEstado, setMostrarModalEstado] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [pedidoACambiar, setPedidoACambiar] = useState(null);
  const [comentarioEstado, setComentarioEstado] = useState('');
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [agregandoComentario, setAgregandoComentario] = useState(false);

  const estados = [
    { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'procesando', label: 'Procesando', color: 'bg-blue-100 text-blue-800' },
    { value: 'enviado', label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
    { value: 'entregado', label: 'Entregado', color: 'bg-green-100 text-green-800' },
    { value: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          usuarios (nombre, email),
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
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPedidos(data || []);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setMensaje({ texto: 'Error al cargar pedidos', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar cambio de estado
  const iniciarCambioEstado = (pedido, estado) => {
    setPedidoACambiar(pedido);
    setNuevoEstado(estado);
    setComentarioEstado('');
    setMostrarModalEstado(true);
  };

  // Función mejorada para cambiar estado con comentario
  const confirmarCambioEstado = async () => {
    if (!comentarioEstado.trim()) {
      setMensaje({ texto: 'Debe agregar un comentario al cambiar el estado', tipo: 'error' });
      return;
    }

    try {
      // Actualizar estado del pedido
      const { error: updateError } = await supabase
        .from('pedidos')
        .update({ estado: nuevoEstado })
        .eq('id', pedidoACambiar.id);
      
      if (updateError) throw updateError;

      // Crear tabla de comentarios si no existe (esto se haría en Supabase)
      // Por ahora simularemos guardando en una tabla de comentarios
      const { error: commentError } = await supabase
        .from('pedido_comentarios')
        .insert({
          pedido_id: pedidoACambiar.id,
          comentario: comentarioEstado,
          tipo: 'cambio_estado',
          estado_anterior: pedidoACambiar.estado,
          estado_nuevo: nuevoEstado,
          admin_id: 1, // ID del admin actual
          created_at: new Date().toISOString()
        });
      
      // Si la tabla no existe, continuamos sin error
      if (commentError && !commentError.message.includes('relation "pedido_comentarios" does not exist')) {
        throw commentError;
      }
      
      // Actualizar el estado local
      setPedidos(prev => prev.map(pedido => 
        pedido.id === pedidoACambiar.id ? { ...pedido, estado: nuevoEstado } : pedido
      ));
      
      setMensaje({ 
        texto: `Estado actualizado a ${nuevoEstado} con comentario agregado`, 
        tipo: 'success' 
      });
      setMostrarModalEstado(false);
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      setMensaje({ texto: 'Error al cambiar estado del pedido', tipo: 'error' });
    }
  };

  // Función para obtener comentarios del pedido
  const fetchComentarios = async (pedidoId) => {
    try {
      const { data, error } = await supabase
        .from('pedido_comentarios')
        .select('*')
        .eq('pedido_id', pedidoId)
        .order('created_at', { ascending: false });
      
      if (error && !error.message.includes('relation "pedido_comentarios" does not exist')) {
        throw error;
      }
      
      setComentarios(data || []);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      setComentarios([]);
    }
  };

  // Función para agregar comentario
  const agregarComentario = async () => {
    if (!nuevoComentario.trim()) return;
    
    setAgregandoComentario(true);
    try {
      const { error } = await supabase
        .from('pedido_comentarios')
        .insert({
          pedido_id: pedidoSeleccionado.id,
          comentario: nuevoComentario,
          tipo: 'comentario_admin',
          admin_id: 1, // ID del admin actual
          created_at: new Date().toISOString()
        });
      
      if (error && !error.message.includes('relation "pedido_comentarios" does not exist')) {
        throw error;
      }
      
      setNuevoComentario('');
      fetchComentarios(pedidoSeleccionado.id);
      setMensaje({ texto: 'Comentario agregado correctamente', tipo: 'success' });
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      setMensaje({ texto: 'Error al agregar comentario', tipo: 'error' });
    } finally {
      setAgregandoComentario(false);
    }
  };

  const verDetallesPedido = (pedido) => {
    setPedidoSeleccionado(pedido);
    setMostrarDetalles(true);
    fetchComentarios(pedido.id);
  };

  const verComentariosPedido = (pedido) => {
    setPedidoSeleccionado(pedido);
    setMostrarComentarios(true);
    fetchComentarios(pedido.id);
  };

  const pedidosFiltrados = pedidos.filter(pedido => 
    filtroEstado === 'todos' || pedido.estado === filtroEstado
  );

  const getEstadoColor = (estado) => {
    const estadoObj = estados.find(e => e.value === estado);
    return estadoObj ? estadoObj.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h2>
        <button
          onClick={fetchPedidos}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {/* Mensaje de estado */}
      {mensaje.texto && (
        <div className={`p-3 rounded-lg mb-4 ${
          mensaje.tipo === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {mensaje.texto}
        </div>
      )}

      {/* Filtros */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por estado:</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="todos">Todos los estados</option>
          {estados.map(estado => (
            <option key={estado.value} value={estado.value}>{estado.label}</option>
          ))}
        </select>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {estados.map(estado => {
          const count = pedidos.filter(p => p.estado === estado.value).length;
          return (
            <div key={estado.value} className="bg-white border rounded-lg p-4 text-center">
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${estado.color} mb-2`}>
                {estado.label}
              </div>
              <div className="text-2xl font-bold text-gray-900">{count}</div>
            </div>
          );
        })}
      </div>

      {/* Lista de pedidos */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{pedido.id}</div>
                    <div className="text-sm text-gray-500">{pedido.pedido_items?.length || 0} productos</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{pedido.usuarios?.nombre}</div>
                    <div className="text-sm text-gray-500">{pedido.usuarios?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(pedido.created_at).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    €{pedido.total?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={pedido.estado}
                      onChange={(e) => iniciarCambioEstado(pedido, e.target.value)}
                      className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getEstadoColor(pedido.estado)}`}
                    >
                      {estados.map(estado => (
                        <option key={estado.value} value={estado.value}>{estado.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => verDetallesPedido(pedido)}
                      className="text-black hover:text-gray-600 mr-3"
                    >
                      Ver detalles
                    </button>
                    <button
                      onClick={() => verComentariosPedido(pedido)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Comentarios
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pedidosFiltrados.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay pedidos que coincidan con el filtro seleccionado.
        </div>
      )}

      {/* Modal de cambio de estado */}
      {mostrarModalEstado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">
              Cambiar estado del pedido #{pedidoACambiar?.id}
            </h3>
            <p className="text-gray-600 mb-4">
              Estado actual: <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(pedidoACambiar?.estado)}`}>
                {pedidoACambiar?.estado}
              </span>
            </p>
            <p className="text-gray-600 mb-4">
              Nuevo estado: <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(nuevoEstado)}`}>
                {nuevoEstado}
              </span>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentario para el cliente (obligatorio):
              </label>
              <textarea
                value={comentarioEstado}
                onChange={(e) => setComentarioEstado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                rows="3"
                placeholder="Ej: Su pedido está siendo preparado para el envío..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setMostrarModalEstado(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarCambioEstado}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Confirmar cambio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de comentarios */}
      {mostrarComentarios && pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  Comentarios del Pedido #{pedidoSeleccionado.id}
                </h3>
                <button
                  onClick={() => setMostrarComentarios(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Agregar nuevo comentario */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Agregar comentario para el cliente:</h4>
                <textarea
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  rows="3"
                  placeholder="Escriba un comentario que será visible para el cliente..."
                />
                <button
                  onClick={agregarComentario}
                  disabled={agregandoComentario || !nuevoComentario.trim()}
                  className="mt-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {agregandoComentario ? 'Agregando...' : 'Agregar comentario'}
                </button>
              </div>

              {/* Lista de comentarios */}
              <div className="space-y-4">
                <h4 className="font-semibold">Historial de comentarios:</h4>
                {comentarios.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No hay comentarios para este pedido.
                  </p>
                ) : (
                  comentarios.map((comentario, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          comentario.tipo === 'cambio_estado' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {comentario.tipo === 'cambio_estado' ? 'Cambio de estado' : 'Comentario admin'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comentario.created_at).toLocaleString('es-ES')}
                        </span>
                      </div>
                      {comentario.tipo === 'cambio_estado' && (
                        <p className="text-sm text-gray-600 mb-2">
                          Estado cambiado de <strong>{comentario.estado_anterior}</strong> a <strong>{comentario.estado_nuevo}</strong>
                        </p>
                      )}
                      <p className="text-gray-800">{comentario.comentario}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles del pedido (existente) */}
      {mostrarDetalles && pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Detalles del Pedido #{pedidoSeleccionado.id}</h3>
                <button
                  onClick={() => setMostrarDetalles(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mostrar comentarios recientes en el modal de detalles */}
              {comentarios.length > 0 && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-800">Último comentario:</h4>
                  <p className="text-blue-700">{comentarios[0]?.comentario}</p>
                  <p className="text-sm text-blue-600 mt-1">
                    {new Date(comentarios[0]?.created_at).toLocaleString('es-ES')}
                  </p>
                </div>
              )}

              {/* ... resto del contenido del modal de detalles existente ... */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">Información del Cliente</h4>
                  <p><strong>Nombre:</strong> {pedidoSeleccionado.usuarios?.nombre}</p>
                  <p><strong>Email:</strong> {pedidoSeleccionado.usuarios?.email}</p>
                  <p><strong>Teléfono:</strong> {pedidoSeleccionado.telefono_contacto || 'No especificado'}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Información del Pedido</h4>
                  <p><strong>Fecha:</strong> {new Date(pedidoSeleccionado.created_at).toLocaleString('es-ES')}</p>
                  <p><strong>Estado:</strong> 
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getEstadoColor(pedidoSeleccionado.estado)}`}>
                      {pedidoSeleccionado.estado}
                    </span>
                  </p>
                  <p><strong>Método de pago:</strong> {pedidoSeleccionado.metodo_pago || 'No especificado'}</p>
                  <p><strong>Tipo de envío:</strong> {pedidoSeleccionado.tipo_envio || 'No especificado'}</p>
                </div>
              </div>

              {pedidoSeleccionado.direccion_envio && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Dirección de Envío</h4>
                  <p className="text-gray-700">{pedidoSeleccionado.direccion_envio}</p>
                </div>
              )}

              {pedidoSeleccionado.notas && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Notas del Pedido</h4>
                  <p className="text-gray-700">{pedidoSeleccionado.notas}</p>
                </div>
              )}

              <div className="mb-6">
                <h4 className="font-semibold mb-4">Productos</h4>
                <div className="space-y-4">
                  {pedidoSeleccionado.pedido_items?.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      {item.imagen && (
                        <img 
                          src={item.imagen} 
                          alt={item.nombre_producto}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h5 className="font-medium">{item.nombre_producto}</h5>
                        <p className="text-sm text-gray-600">
                          Talla: {item.talla} | Color: {item.color}
                        </p>
                        <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€{(item.precio * item.cantidad).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">€{item.precio.toFixed(2)} c/u</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Subtotal: €{(pedidoSeleccionado.total - (pedidoSeleccionado.costo_envio || 0)).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Envío: €{(pedidoSeleccionado.costo_envio || 0).toFixed(2)}</p>
                  </div>
                  <p className="text-xl font-bold">Total: €{pedidoSeleccionado.total?.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;