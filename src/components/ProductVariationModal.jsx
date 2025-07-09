import React, { useState, useEffect } from 'react';

const ProductVariationModal = ({ isOpen, onClose, product, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [stockPorTalla, setStockPorTalla] = useState({});

  // Tallas y colores por defecto si el producto no los tiene definidos
  const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const defaultColors = ['Negro', 'Blanco', 'Gris', 'Azul', 'Rojo', 'Verde', 'Rosa', 'Amarillo'];

  // Obtener tallas y colores del producto o usar los por defecto
  const availableSizes = (product?.tallas && product.tallas.length > 0) ? product.tallas : 
                     (product?.sizes && product.sizes.length > 0) ? product.sizes : 
                     defaultSizes;
                     
  const availableColors = (product?.colores && product.colores.length > 0) ? product.colores : 
                       (product?.colors && product.colors.length > 0) ? product.colors : 
                       defaultColors;

  // Determinar si el producto tiene variaciones
  const hasSizes = availableSizes.length > 0;
  const hasColors = availableColors.length > 0;

  useEffect(() => {
    if (isOpen && product) {
      // Resetear selecciones cuando se abre el modal
      setSelectedSize(product?.talla || '');
      setSelectedColor(product?.color || '');
      setQuantity(1);
      setError('');
      
      // Parsear stock por talla
      try {
        let stockData = {};
        if (product.stock_por_talla) {
          if (typeof product.stock_por_talla === 'string') {
            stockData = JSON.parse(product.stock_por_talla);
          } else {
            stockData = product.stock_por_talla;
          }
        }
        setStockPorTalla(stockData);
      } catch (error) {
        console.error('Error parsing stock_por_talla:', error);
        setStockPorTalla({});
      }
    }
  }, [isOpen, product]);

  // Función para obtener el stock de una talla
  const getStockForSize = (size) => {
    return stockPorTalla[size] || 0;
  };

  // Función para verificar si una talla está disponible
  const isSizeAvailable = (size) => {
    return getStockForSize(size) > 0;
  };

  // Función para verificar si una talla tiene stock bajo
  const isLowStock = (size) => {
    const stock = getStockForSize(size);
    return stock > 0 && stock < 5;
  };

  const handleAddToCart = () => {
    // Validar que se hayan seleccionado las opciones requeridas
    if (hasSizes && !selectedSize) {
      setError('Por favor selecciona una talla');
      return;
    }
    if (hasColors && !selectedColor) {
      setError('Por favor selecciona un color');
      return;
    }

    // Verificar stock disponible para la talla seleccionada
    if (hasSizes && selectedSize) {
      const availableStock = getStockForSize(selectedSize);
      if (availableStock === 0) {
        setError('Esta talla no está disponible');
        return;
      }
      if (quantity > availableStock) {
        setError(`Solo quedan ${availableStock} unidades de esta talla`);
        return;
      }
    }

    // Llamar a la función de añadir al carrito con las variaciones seleccionadas
    onAddToCart({
      ...product,
      selectedSize: hasSizes ? selectedSize : undefined,
      selectedColor: hasColors ? selectedColor : undefined,
      quantity
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Seleccionar opciones</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Información del producto */}
          <div className="flex items-center space-x-4">
            <img
              src={product?.imagen || product?.image}
              alt={product?.nombre || product?.name}
              className="w-16 h-16 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/64x64?text=Imagen+no+disponible';
              }}
            />
            <div>
              <h3 className="font-semibold text-gray-900">{product?.nombre || product?.name}</h3>
              <p className="text-lg font-bold text-gray-900">${product?.precio || product?.price}</p>
            </div>
          </div>

          {/* Selector de talla */}
          {hasSizes && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">TALLA *</h3>
              <div className="grid grid-cols-3 gap-2">
                {availableSizes.map((size) => {
                  const stock = getStockForSize(size);
                  const available = isSizeAvailable(size);
                  const lowStock = isLowStock(size);
                  
                  return (
                    <div key={size} className="relative">
                      <button
                        onClick={() => available && setSelectedSize(size)}
                        disabled={!available}
                        className={`w-full py-3 px-4 border rounded-lg text-sm font-medium transition-all relative ${
                          selectedSize === size
                            ? 'border-black bg-black text-white'
                            : available
                            ? 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                            : 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
                        }`}
                      >
                        {size}
                        {!available && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[30px] h-0.5 bg-gray-400 transform rotate-45"></div>
                          </div>
                        )}
                      </button>
                      {available && lowStock && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 py-0.5 rounded text-center">
                          ¡Últimas!
                        </div>
                      )}
                      {available && (
                        <div className="text-xs text-gray-500 text-center mt-1">
                          {stock} disponibles
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selector de color */}
          {hasColors && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">COLOR *</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`py-3 px-4 border rounded-lg text-sm font-medium transition-all ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de cantidad */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">CANTIDAD</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                -
              </button>
              <span className="text-lg font-medium w-12 text-center">{quantity}</span>
              <button
                onClick={() => {
                  const maxStock = selectedSize ? getStockForSize(selectedSize) : 999;
                  setQuantity(Math.min(maxStock, quantity + 1));
                }}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                +
              </button>
            </div>
            {selectedSize && (
              <p className="text-sm text-gray-500 mt-2">
                Stock disponible: {getStockForSize(selectedSize)}
              </p>
            )}
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          <button
            onClick={handleAddToCart}
            disabled={hasSizes && selectedSize && !isSizeAvailable(selectedSize)}
            className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-colors ${
              hasSizes && selectedSize && !isSizeAvailable(selectedSize)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {hasSizes && selectedSize && !isSizeAvailable(selectedSize) 
              ? 'NO DISPONIBLE' 
              : 'AÑADIR AL CARRITO'
            }
          </button>
          <button
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductVariationModal;