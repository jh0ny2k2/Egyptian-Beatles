import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import ProductVariationModal from './ProductVariationModal';

const AllProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Obtener parámetros de la URL
    const urlSearchTerm = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlBadge = searchParams.get('badge') || '';
    
    // Establecer término de búsqueda
    setSearchTerm(urlSearchTerm);
    
    // Establecer categoría si existe en la URL
    if (urlCategory) {
      setFilters(prev => ({
        ...prev,
        categories: [urlCategory]
      }));
    }

    // Filtrar por badge si existe en la URL
    if (urlBadge) {
      // Aquí puedes implementar la lógica para filtrar por badge
      // Por ejemplo, podrías añadir un nuevo estado para badges o usar el existente
      // Esto dependerá de cómo estén estructurados tus datos de productos
      console.log(`Filtrando por badge: ${urlBadge}`);
      
      // Ejemplo: filtrar productos que tengan el badge especificado
      const filteredByBadge = products.filter(product => product.badge === urlBadge);
      setFilteredProducts(filteredByBadge);
    }
  }, [searchParams, products]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      console.log('Productos cargados:', data);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filtro por término de búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(product => 
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categorías
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    // Filtro por tallas
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.sizes) return false;
        const productSizes = Array.isArray(product.sizes) ? product.sizes : JSON.parse(product.sizes || '[]');
        return filters.sizes.some(size => productSizes.includes(size));
      });
    }

    // Filtro por colores
    if (filters.colors.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.colors) return false;
        const productColors = Array.isArray(product.colors) ? product.colors : JSON.parse(product.colors || '[]');
        return filters.colors.some(color => productColors.includes(color));
      });
    }

    // Filtro por precio
    if (filters.priceRange.length > 0) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price.replace('$', ''));
        return filters.priceRange.some(range => {
          switch(range) {
            case 'under50':
              return price < 50;
            case '50to100':
              return price >= 50 && price <= 100;
            case 'over100':
              return price > 100;
            default:
              return true;
          }
        });
      });
    }
    
    setFilteredProducts(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const currentFilters = prev[filterType];
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter(item => item !== value)
        : [...currentFilters, value];
      
      return {
        ...prev,
        [filterType]: newFilters
      };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      priceRange: []
    });
    setSearchTerm('');
    setSearchParams({});
  };

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    
    if (newSearchTerm.trim()) {
      setSearchParams({ search: newSearchTerm });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/400x400?text=Imagen+no+disponible';
  };

  const handleAddToCart = (product) => {
    // Verificar si el producto tiene variaciones (tallas o colores)
    const hasVariations = (product.sizes && product.sizes.length > 0) || 
                         (product.colors && product.colors.length > 0);
    
    if (hasVariations) {
      setSelectedProduct(product);
      setModalOpen(true);
    } else {
        addToCart({
          id: product.id,
          name: product.nombre,
          price: product.price,
          image: product.imagen,
          category: product.category,
          quantity: 1
        });
      }
    };

  const handleModalAddToCart = (productWithVariations) => {
    addToCart({
      id: productWithVariations.id,
      name: productWithVariations.nombre,
      price: productWithVariations.precio || productWithVariations.price,
      image: productWithVariations.imagen,
      category: productWithVariations.category,
      selectedSize: productWithVariations.selectedSize,
      selectedColor: productWithVariations.selectedColor,
      quantity: productWithVariations.quantity
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full">
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"
          alt="Banner tienda de ropa"
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg uppercase">
            {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos los productos'}
          </h1>
        </div>
      </div>
    
      <section className="px-4 py-10 bg-white">
        {/* Barra superior con filtros */}
        <div className="mb-8">
          {/* Contador de productos y controles */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{filteredProducts.length} PRODUCTOS</span>
            </div>
            
            <div className="flex flex-row sm:flex-row items-stretch sm:items-center gap-3">
              {/* Barra de búsqueda compacta - Móvil primero */}
              <div className="relative flex-1 sm:flex-none">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full sm:w-64 px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {/* Botón de filtros - Más prominente en móvil */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex-1 sm:flex-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z" />
                  </svg>
                  <span className="hidden sm:inline">FILTRAR Y ORDENAR</span>
                  <span className="sm:hidden">FILTROS</span>
                  <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                
              </div>
            </div>
          </div>
          
          {/* Panel de filtros desplegable - Optimizado para móvil */}
          {showFilters && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Filtro de Categoría */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900 text-base">Categoría</h3>
                  <div className="space-y-3">
                    {['Camisetas', 'Pantalones', 'Vestidos', 'Abrigos'].map(category => (
                      <label key={category} className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-3 rounded w-4 h-4" 
                          checked={filters.categories.includes(category)}
                          onChange={() => handleFilterChange('categories', category)}
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Filtro de Precio */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900 text-base">Precio</h3>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-3 rounded w-4 h-4" 
                        checked={filters.priceRange.includes('under50')}
                        onChange={() => handleFilterChange('priceRange', 'under50')}
                      />
                      <span className="text-sm text-gray-700">Menos de $50</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-3 rounded w-4 h-4" 
                        checked={filters.priceRange.includes('50to100')}
                        onChange={() => handleFilterChange('priceRange', '50to100')}
                      />
                      <span className="text-sm text-gray-700">$50 - $100</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-3 rounded w-4 h-4" 
                        checked={filters.priceRange.includes('over100')}
                        onChange={() => handleFilterChange('priceRange', 'over100')}
                      />
                      <span className="text-sm text-gray-700">Más de $100</span>
                    </label>
                  </div>
                </div>
                
                {/* Filtro de Talla */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900 text-base">Talla</h3>
                  <div className="space-y-3">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                      <label key={size} className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-3 rounded w-4 h-4" 
                          checked={filters.sizes.includes(size)}
                          onChange={() => handleFilterChange('sizes', size)}
                        />
                        <span className="text-sm text-gray-700">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Filtro de Color */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900 text-base">Color</h3>
                  <div className="space-y-3">
                    {['Rojo', 'Azul', 'Negro', 'Blanco', 'Verde', 'Rosa', 'Amarillo', 'Gris'].map(color => (
                      <label key={color} className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-3 rounded w-4 h-4" 
                          checked={filters.colors.includes(color)}
                          onChange={() => handleFilterChange('colors', color)}
                        />
                        <span className="text-sm text-gray-700">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Botones de acción - Optimizados para móvil */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 underline py-2 sm:py-0"
                >
                  Limpiar todos los filtros
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-6 py-3 sm:py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Grid de productos - Optimizado para móvil */}
        <div className="w-full">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-base mb-4">
                {searchTerm || Object.values(filters).some(arr => arr.length > 0) 
                  ? 'No se encontraron productos con los filtros aplicados' 
                  : 'No se encontraron productos'
                }
              </p>
              {(searchTerm || Object.values(filters).some(arr => arr.length > 0)) && (
                <button
                  onClick={clearAllFilters}
                  className="text-indigo-600 hover:text-indigo-800 underline text-sm"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="relative group overflow-hidden transition-all duration-300">
                  <Link to={`/producto/${product.id}`} className="block">
                    <div className="aspect-square overflow-hidden relative">
                      {product.badge && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
                          {product.badge}
                        </span>
                      )}
                      {/* Imagen principal */}
                      <img
                        src={product.imagen}
                        alt={product.nombre}
                        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
                        onError={handleImageError}
                        loading="lazy"
                      />
                      {/* Imagen secundaria (visible en hover) */}
                      <img
                        src={product.imagen1 || product.imagen}
                        alt={`${product.nombre} - vista alternativa`}
                        className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0"
                        onError={handleImageError}
                      />
                      
                      {/* Botón de añadir al carrito (visible en hover en desktop, siempre visible en móvil) */}
                      <div className="absolute bottom-2 left-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          className="w-full bg-white text-black py-2 sm:py-3 font-medium text-center shadow-md hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                          onClick={(e) => handleAddToCart(product, e)}
                          aria-label="Añadir a la cesta"
                        >
                          Añadir a la cesta
                        </button>
                      </div>
                    </div>
                    <div className="p-2 sm:p-4">
                      <div className="uppercase text-xs text-gray-500 mb-1">{product.category}</div>
                      <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base line-clamp-2">{product.nombre}</h3>
                      <div className="font-bold text-black text-sm sm:text-base">{product.price}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Modal de variaciones */}
      <ProductVariationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
        onAddToCart={handleModalAddToCart}
      />
    </>
  );
};

export default AllProductsSection;