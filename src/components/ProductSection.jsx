import React from 'react'

const ProductSection = () => {
  const products = [
    {
      id: 1,
      name: "CAMISETA EGYPTIAN BEATLES VINTAGE",
      price: "$29.990",
      originalPrice: "$39.990",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Camisetas",
      badge: "NUEVO"
    },
    {
      id: 2,
      name: "HOODIE ABBEY ROAD PYRAMID",
      price: "$49.990",
      originalPrice: "$69.990",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Hoodies",
      badge: "SALE"
    },
    {
      id: 3,
      name: "CHAQUETA PHARAOH LEATHER",
      price: "$89.990",
      originalPrice: "$129.990",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Chaquetas",
      badge: "LIMITADO"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fashion Collections Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 flex items-center justify-center">
              <span className="text-4xl mr-3">𓂀</span>
              COLECCIONES EXCLUSIVAS
              <span className="text-4xl ml-3">𓂀</span>
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">Descubre nuestras colecciones inspiradas en la mística egipcia y el legado musical de los Beatles</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left - Large Image */}
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Egyptian Beatles Collection" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center">
                <div className="text-center text-white p-8">
                  <div className="flex justify-center space-x-4 mb-4 text-3xl">
                    <span>𓂀</span><span>🎸</span><span>𓁹</span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold mb-4">Egyptian Beatles</h3>
                  <p className="text-lg mb-6 text-gray-100">Colección exclusiva que fusiona dos culturas icónicas</p>
                  <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-all duration-200 transform hover:scale-105">
                    Ver colección completa
                  </button>
                </div>
              </div>
            </div>
            {/* Right - Stacked Images */}
            <div className="space-y-4">
              <div className="relative h-36 lg:h-40 rounded-xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Hombres" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <h4 className="text-white text-xl font-semibold flex items-center">
                    <span className="mr-2">👔</span> Hombres
                  </h4>
                </div>
              </div>
              <div className="relative h-36 lg:h-40 rounded-xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Mujeres" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <h4 className="text-white text-xl font-semibold flex items-center">
                    <span className="mr-2">👗</span> Mujeres
                  </h4>
                </div>
              </div>
              <div className="relative h-36 lg:h-40 rounded-xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1506629905607-d405b7a82d52?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Accesorios" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <h4 className="text-white text-xl font-semibold flex items-center">
                    <span className="mr-2">👑</span> Accesorios
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Products Grid */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">PRODUCTOS DESTACADOS</h3>
          <p className="text-gray-700">Los favoritos de nuestra comunidad Egyptian Beatles</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative rounded-xl aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 rounded transition-transform duration-500"
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
                  <button className="bg-white text-black px-6 py-2 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 border border-black">
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
                  <button className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition-all duration-200 transform hover:scale-105">
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-900 transition-all duration-200 transform hover:scale-105 shadow-lg">
            Ver toda la colección
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProductSection