import React, { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ProductVariationModal from './ProductVariationModal';

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  const handleAddToCartClick = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Verificar si el producto tiene variaciones (tallas o colores)
    const hasSizes = product.tallas && product.tallas.length > 0;
    const hasColors = product.colores && product.colores.length > 0;
    
    if (hasSizes || hasColors) {
      // Abrir modal para seleccionar variaciones
      setSelectedProduct(product);
      setModalOpen(true);
    } else {
      // Añadir directamente al carrito si no hay variaciones
      addToCart({
        id: product.id,
        name: product.nombre,
        price: product.precio || product.price,
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
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">PRODUCTOS DESTACADOS</h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Descubre los favoritos de nuestra comunidad Egyptian Beatles, seleccionados especialmente para ti</p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mt-6 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="group">
                <Link to={`/producto/${product.id}`} className="block">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-4 group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                    {/* Imagen principal */}
                    <img
                      src={product.imagen}
                      alt={product.nombre}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-0 absolute inset-0"
                      onError={handleImageError}
                    />
                    {/* Imagen secundaria (visible en hover) */}
                    <img
                      src={product.imagen1 || product.imagen}
                      alt={`${product.nombre} - vista alternativa`}
                      className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500 absolute inset-0"
                      onError={handleImageError}
                    />
                    
                    {/* Overlay con gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Botón de añadir al carrito mejorado */}
                    <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <button
                        className="w-full bg-white/95 backdrop-blur-sm text-black py-3 px-4 font-semibold text-center shadow-xl rounded-full hover:bg-white transition-all duration-200 hover:scale-105"
                        onClick={(e) => handleAddToCartClick(product, e)}
                        aria-label="Añadir a la cesta"
                      >
                        Añadir a la cesta
                      </button>
                    </div>
                    
                    {/* Badge de categoría */}
                    <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      {product.category}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg group-hover:text-amber-600 transition-colors">{product.nombre}</h3>
                    <div className="font-bold text-xl text-gray-900">{product.precio || product.price}</div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center h-64">
              <div className="text-gray-500 text-lg">No hay productos disponibles</div>
            </div>
          )}
        </div>
        
        {/* Botón Ver más mejorado */}
        <div className="text-center mt-16">
          <Link to="/productos"> 
            <button className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white px-12 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              Ver Toda la Colección
            </button> 
          </Link>
        </div>
      </div>
      
      {/* Modal de variaciones */}
      <ProductVariationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
        onAddToCart={handleModalAddToCart}
      />
    </section>
  );
};

export default ProductSection;