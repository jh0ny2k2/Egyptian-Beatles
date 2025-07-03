import React, { useState, useRef, useEffect } from "react";

const ProductSection = () => {
  const [startIdx, setStartIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef(null);
  
  const products = [
    {
      id: 1,
      name: "Camiseta Vintage",
      price: "$29.99",
      originalPrice: "$39.99",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      category: "Camisetas",
      badge: "SALE"
    },
    {
      id: 2,
      name: "Jeans Clásicos",
      price: "$59.99",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
      category: "Pantalones",
      badge: "NUEVO"
    },
    {
      id: 3,
      name: "Chaqueta Denim",
      price: "$79.99",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
      category: "Chaquetas"
    },
    {
      id: 4,
      name: "Sudadera Oversize",
      price: "$49.99",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
      category: "Sudaderas"
    },
    {
      id: 5,
      name: "Vestido Casual",
      price: "$39.99",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
      category: "Vestidos"
    },
    {
      id: 6,
      name: "Camisa Formal",
      price: "$45.99",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
      category: "Camisas"
    },
    {
      id: 7,
      name: "Shorts Deportivos",
      price: "$24.99",
      image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400",
      category: "Shorts"
    },
    {
      id: 8,
      name: "Blazer Elegante",
      price: "$89.99",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      category: "Blazers"
    }
  ];

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 0.8; // Reducido de 2 a 0.8 para menos sensibilidad
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 0.8; // Reducido de 2 a 0.8 para menos sensibilidad
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <section className="py-16 px-4">
      <div className="text-center mb-12">
        <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">PRODUCTOS DESTACADOS</h3>
        <p className="text-gray-700">Los favoritos de nuestra comunidad Egyptian Beatles</p>
      </div>
      
      <div 
        ref={containerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' }
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {products.map((product) => (
          <div key={product.id} className="group bg-white rounded overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[280px] flex-shrink-0">
            <div className="relative rounded-xl aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 rounded transition-transform duration-500 pointer-events-none"
                draggable={false}
              />
              {product.badge && (
                <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full ${
                  product.badge === 'SALE' ? 'bg-red-500 text-white' :
                  product.badge === 'NUEVO' ? 'bg-green-500 text-white' :
                  'bg-black text-white'
                }`}>
                  {product.badge}
                </span>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <button className="bg-white text-black px-6 py-2 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 border border-black pointer-events-auto">
                  Ver detalles
                </button>
              </div>
            </div>
            <div className="p-6 mt-4 rounded-xl bg-gray-300">
              <div className="text-sm text-gray-600 font-medium mb-2">{product.category}</div>
              <h3 className="font-semibold text-black mb-3 group-hover:text-gray-900 transition-colors">{product.name}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-black">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  )}
                </div>
                <button className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition-all duration-200 transform hover:scale-105 pointer-events-auto">
                  Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ProductSection;