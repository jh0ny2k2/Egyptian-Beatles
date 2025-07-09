import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('id', parseInt(id))
        .single();

      if (error) {
        throw error;
      }

      setProduct(data);
      setSelectedSize(data.talla || '');
      setSelectedColor(data.color || '');
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Producto no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        selectedSize,
        selectedColor,
        quantity
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-red-500 text-lg">{error || 'Producto no encontrado'}</div>
      </div>
    );
  }

  const images = [
    product.imagen_url,
    product.imagen_hover_url
  ].filter(Boolean);

  // Si no hay imágenes en los campos esperados, usar campos alternativos
  const fallbackImages = [
    product.imagen_url || product.image || product.imagen,
    product.imagen_hover_url || product.image1
  ].filter(Boolean);

  const finalImages = images.length > 0 ? images : fallbackImages;

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = ['Negro', 'Blanco', 'Gris', 'Azul', 'Rojo'];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <img 
                src={finalImages[selectedImage] || product.imagen_url || product.image || product.imagen || '/placeholder-image.jpg'} 
                alt={product.nombre || product.name || 'Producto'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </div>
            
            {/* Miniaturas */}
            {finalImages.length > 1 && (
              <div className="flex space-x-2">
                {finalImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={image}
                      alt={`${product.nombre || product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Título y precio */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.nombre || product.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-gray-900">€{product.precio || product.price}</span>
                {(product.precio_original || product.original_price) && (
                  <span className="text-lg text-gray-500 line-through">€{product.precio_original || product.original_price}</span>
                )}
              </div>
            </div>

            {/* Descripción */}
            {(product.descripcion || product.description) && (
              <div>
                <p className="text-gray-600 leading-relaxed">{product.descripcion || product.description}</p>
              </div>
            )}

            {/* Selector de talla */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">TALLA</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de color */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">COLOR</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Cantidad */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">CANTIDAD</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:border-gray-400"
                >
                  -
                </button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:border-gray-400"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botón de añadir al carrito */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-4 px-6 rounded-md font-medium text-lg hover:bg-gray-800 transition-colors"
            >
              AÑADIR AL CARRITO
            </button>

            {/* Información adicional */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Envío gratuito en pedidos superiores a €50</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm text-gray-600">Devoluciones gratuitas en 30 días</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;