import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    precio_original: '',
    descripcion: '',
    categoria: '',
    imagen: '',
    imagen1: '',
    badge: '',
    stock: 0,
    tallas: [],
    colores: []
  });
  const [imageFiles, setImageFiles] = useState({
    imagen: null,
    imagen1: null
  });
  const [imagePreviews, setImagePreviews] = useState({
    imagen: '',
    imagen1: ''
  });

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Función para obtener todos los productos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para manejar cambios en arrays (tallas, colores)
  const handleArrayChange = (e, field) => {
    const value = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para manejar la subida de archivos
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona solo archivos de imagen');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB');
        return;
      }

      setImageFiles(prev => ({
        ...prev,
        [field]: file
      }));

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => ({
          ...prev,
          [field]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para subir imagen a Supabase Storage
  const uploadImage = async (file, fileName) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `productos/${fileName}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('imagenes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('imagenes')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }
  };

  // Función para editar un producto
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setFormData({
      nombre: product.nombre || '',
      precio: product.price || '',
      precio_original: product.precio_original || '',
      descripcion: product.descripcion || '',
      categoria: product.category || '',
      imagen: product.imagen || '',
      imagen1: product.imagen1 || '',
      badge: product.badge || '',
      stock: product.stock || '',
      tallas: product.sizes || [],
      colores: product.colors || []
    });
    
    // Establecer previews de imágenes existentes
    setImagePreviews({
      imagen: product.imagen || '',
      imagen1: product.imagen1 || ''
    });
    
    // Limpiar archivos seleccionados
    setImageFiles({
      imagen: null,
      imagen1: null
    });
    
    setShowForm(true);
  };

  // Función para crear un nuevo producto
  const handleNew = () => {
    setCurrentProduct(null);
    setFormData({
      nombre: '',
      precio: '',
      precio_original: '',
      descripcion: '',
      categoria: '',
      imagen: '',
      imagen1: '',
      badge: '',
      stock: 0,
      tallas: [],
      colores: []
    });
    setImageFiles({
      imagen: null,
      imagen1: null
    });
    setImagePreviews({
      imagen: '',
      imagen1: ''
    });
    setShowForm(true);
  };

  // Función para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);

    try {
      // Validar campos obligatorios
      if (!formData.nombre || !formData.precio || !formData.categoria) {
        alert('Por favor, completa los campos obligatorios: nombre, precio y categoría');
        setLoading(false);
        setUploading(false);
        return;
      }

      let imagenUrl = formData.imagen;
      let imagen1Url = formData.imagen1;

      // Subir imagen principal si se seleccionó una nueva
      if (imageFiles.imagen) {
        const fileName = `${Date.now()}_${formData.nombre.replace(/\s+/g, '_')}_principal`;
        imagenUrl = await uploadImage(imageFiles.imagen, fileName);
      }

      // Subir imagen adicional si se seleccionó una nueva
      if (imageFiles.imagen1) {
        const fileName = `${Date.now()}_${formData.nombre.replace(/\s+/g, '_')}_adicional`;
        imagen1Url = await uploadImage(imageFiles.imagen1, fileName);
      }

      // Preparar datos para guardar
      const productData = {
        nombre: formData.nombre,
        precio: formData.precio,
        precio_original: formData.precio_original || null,
        descripcion: formData.descripcion || null,
        categoria: formData.categoria,
        imagen: imagenUrl || null,
        imagen1: imagen1Url || null,
        badge: formData.badge || null,
        stock: formData.stock || 0,
        tallas: formData.tallas || [],
        colores: formData.colores || []
      };

      let result;

      if (currentProduct) {
        // Actualizar producto existente
        result = await supabase
          .from('productos')
          .update(productData)
          .eq('id', currentProduct.id);
      } else {
        // Crear nuevo producto
        result = await supabase
          .from('productos')
          .insert([productData]);
      }

      if (result.error) throw result.error;

      // Actualizar la lista de productos
      fetchProducts();
      setShowForm(false);
      alert(currentProduct ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      alert('Error al guardar el producto: ' + error.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  // Función para eliminar un producto
  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Actualizar la lista de productos
      setProducts(products.filter(product => product.id !== id));
      alert('Producto eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('Error al eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestión de Productos</h2>
        <button 
          onClick={handleNew}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Nuevo Producto
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {showForm ? (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-medium mb-4">
            {currentProduct ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                <input
                  type="text"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                <input
                  type="text"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Original</label>
                <input
                  type="text"
                  name="precio_original"
                  value={formData.precio_original}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
                <input
                  type="text"
                  name="imagen"
                  value={formData.imagen}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen Adicional</label>
                <input
                  type="text"
                  name="imagen1"
                  value={formData.imagen1}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge (ej: NUEVO, SALE)</label>
                <input
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tallas (separadas por comas)</label>
                <input
                  type="text"
                  value={formData.tallas.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'tallas')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Colores (separados por comas)</label>
                <input
                  type="text"
                  value={formData.colores.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'colores')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
              >
                {uploading ? 'Subiendo imágenes...' : loading ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Tabla de productos */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && products.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  Cargando productos...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay productos disponibles
                </td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.imagen ? (
                      <img src={product.imagen} alt={product.nombre} className="h-10 w-10 object-cover rounded" />
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductManagement;