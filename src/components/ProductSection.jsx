import React, { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  
  useEffect(() => {
    fetchRandomProducts();
  }, []);

  const fetchRandomProducts = async () => {
    try {
      setLoading(true);
      // Primero obtenemos todos los productos
      const { data, error } = await supabase
        .from('productos')
        .select('*');

      if (error) {
        throw error;
      }

      console.log('Productos cargados:', data); // Para depuración

      if (data && data.length > 0) {
        // Seleccionamos 5 productos aleatorios
        const randomProducts = getRandomProducts(data, 4);
        setProducts(randomProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setError('Error al cargar los productos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para seleccionar n productos aleatorios de un array
  const getRandomProducts = (array, n) => {
    // Si el array tiene menos elementos que n, devolvemos todo el array
    if (array.length <= n) {
      return array;
    }
    
    // Creamos una copia del array para no modificar el original
    const shuffled = [...array];
    
    // Algoritmo de Fisher-Yates para mezclar el array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Devolvemos los primeros n elementos
    return shuffled.slice(0, n);
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
      price: product.precio || product.price,
      image: product.imagen,
      category: product.category
    });
  };

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">PRODUCTOS DESTACADOS</h3>
          <p className="text-gray-700">Los favoritos de nuestra comunidad Egyptian Beatles</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando productos...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">PRODUCTOS DESTACADOS</h3>
          <p className="text-gray-700">Los favoritos de nuestra comunidad Egyptian Beatles</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="text-center mb-12">
        <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">PRODUCTOS DESTACADOS</h3>
        <p className="text-gray-700">Los favoritos de nuestra comunidad Egyptian Beatles</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="relative group rounded-xs overflow-hidden transition-all duration-300">
              <Link to={`/producto/${product.id}`} className="block">
                <div className="aspect-square overflow-hidden  relative">
                  {/* Imagen principal */}
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
                    onError={handleImageError}
                  />
                  {/* Imagen secundaria (visible en hover) */}
                  <img
                    src={product.imagen1 || product.imagen}
                    alt={`${product.nombre} - vista alternativa`}
                    className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0"
                    onError={handleImageError}
                  />
                  
                  {/* Botón de añadir al carrito (visible en hover) - Ahora encima de la imagen */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      className="w-full bg-white text-black py-3 font-medium text-center shadow-md"
                      onClick={(e) => handleAddToCart(product, e)}
                      aria-label="Añadir a la cesta"
                    >
                      Añadir a la cesta
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="uppercase text-xs text-gray-500 mb-1">{product.category}</div>
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">{product.nombre}</h3>
                  <div className="font-bold text-black">{product.precio || product.price}</div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center h-64">
            <div className="text-gray-500">No hay productos disponibles</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;