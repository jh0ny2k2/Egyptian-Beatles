import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';

const AllProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Estados para filtros (ahora con sizes y colors activos)
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

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.nombre,
      price: product.price,
      image: product.imagen,
      category: product.category
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
    
      <section className="flex flex-col md:flex-row gap-8 px-4 py-10 bg-white">
        <aside className="w-full md:w-1/5 mb-8 md:mb-0">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            {/* Barra de búsqueda */}
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 mr-2 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="font-semibold text-lg">Buscar</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {(searchTerm || Object.values(filters).some(arr => arr.length > 0)) && (
                <div className="mt-2 text-sm text-gray-600">
                  {filteredProducts.length} producto(s) encontrado(s)
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z" />
                </svg>
                <span className="font-semibold text-lg">Filtros</span>
              </div>
              {Object.values(filters).some(arr => arr.length > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-800 underline"
                >
                  Limpiar todo
                </button>
              )}
            </div>
            <hr className="mb-2" />
            
            <div className="divide-y divide-gray-200">
              {/* Filtro de Categoría */}
              <details className="py-2" open>
                <summary className="font-semibold cursor-pointer flex justify-between items-center">Categoría <span className="ml-2">▾</span></summary>
                <ul className="pl-4 mt-2 text-sm text-gray-700">
                  {['Camisetas', 'Pantalones', 'Vestidos', 'Abrigos'].map(category => (
                    <li key={category} className="mb-1">
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-2" 
                          checked={filters.categories.includes(category)}
                          onChange={() => handleFilterChange('categories', category)}
                        />
                        {category}
                      </label>
                    </li>
                  ))}
                </ul>
              </details>
              
              {/* Filtro de Precio */}
              <details className="py-2">
                <summary className="font-semibold cursor-pointer flex justify-between items-center">Precio <span className="ml-2">▾</span></summary>
                <ul className="pl-4 mt-2 text-sm text-gray-700">
                  <li className="mb-1">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={filters.priceRange.includes('under50')}
                        onChange={() => handleFilterChange('priceRange', 'under50')}
                      />
                      Menos de $50
                    </label>
                  </li>
                  <li className="mb-1">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={filters.priceRange.includes('50to100')}
                        onChange={() => handleFilterChange('priceRange', '50to100')}
                      />
                      $50 - $100
                    </label>
                  </li>
                  <li className="mb-1">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={filters.priceRange.includes('over100')}
                        onChange={() => handleFilterChange('priceRange', 'over100')}
                      />
                      Más de $100
                    </label>
                  </li>
                </ul>
              </details>
              
              {/* Filtro de Talla */}
              <details className="py-2">
                <summary className="font-semibold cursor-pointer flex justify-between items-center">Talla <span className="ml-2">▾</span></summary>
                <ul className="pl-4 mt-2 text-sm text-gray-700">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <li key={size} className="mb-1">
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-2" 
                          checked={filters.sizes.includes(size)}
                          onChange={() => handleFilterChange('sizes', size)}
                        />
                        {size}
                      </label>
                    </li>
                  ))}
                </ul>
              </details>
              
              {/* Filtro de Color */}
              <details className="py-2">
                <summary className="font-semibold cursor-pointer flex justify-between items-center">Color <span className="ml-2">▾</span></summary>
                <ul className="pl-4 mt-2 text-sm text-gray-700">
                  {['Rojo', 'Azul', 'Negro', 'Blanco', 'Verde', 'Rosa', 'Amarillo', 'Gris'].map(color => (
                    <li key={color} className="mb-1">
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-2" 
                          checked={filters.colors.includes(color)}
                          onChange={() => handleFilterChange('colors', color)}
                        />
                        {color}
                      </label>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        </aside>
        
        {/* Grid de productos */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm || Object.values(filters).some(arr => arr.length > 0) 
                    ? 'No se encontraron productos con los filtros aplicados' 
                    : 'No se encontraron productos'
                  }
                </p>
                {(searchTerm || Object.values(filters).some(arr => arr.length > 0)) && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 underline"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="relative group">
                    <Link
                      to={`/producto/${product.id}`}
                      className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col items-center p-4 group overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      style={{ textDecoration: "none" }}
                    >
                      {product.badge && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
                          {product.badge}
                        </span>
                      )}
                      <div className="w-full aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                        <img
                          src={product.imagen}
                          alt={product.nombre}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          onError={handleImageError}
                          loading="lazy"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 w-full text-left mb-1 truncate">{product.nombre}</h3>
                      <span className="text-gray-500 text-sm w-full text-left mb-2 truncate">{product.category}</span>
                      <div className="flex items-center justify-between w-full mt-auto">
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-black">{product.price}</span>
                        </div>
                      </div>
                    </Link>
                    <button
                      className="absolute bottom-4 right-4 p-2 rounded-xl border border-gray-300 bg-white shadow hover:bg-gray-50 transition-colors duration-200 opacity-90 group-hover:opacity-100"
                      onClick={(e) => handleAddToCart(product, e)}
                      aria-label="Añadir al carrito"
                    >
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AllProductsSection;