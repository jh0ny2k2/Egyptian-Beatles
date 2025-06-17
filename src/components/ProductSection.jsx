const ProductSection = () => {
  const products = [
    {
      id: 1,
      title: "CAMISETAS",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description: "Camisetas de algodón premium con diseños únicos",
      category: "Básicos"
    },
    {
      id: 2,
      title: "ACCESORIOS",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description: "Gorras, relojes y accesorios de estilo urbano",
      category: "Complementos"
    },
    {
      id: 3,
      title: "COLECCIÓN PREMIUM",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description: "Piezas exclusivas de edición limitada",
      category: "Premium"
    },
    {
      id: 4,
      title: "STREETWEAR",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description: "Hoodies y sudaderas de alta calidad",
      category: "Urbano"
    }
  ]

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light tracking-widest text-gray-900 mb-4">
            NUESTRAS COLECCIONES
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra selección de ropa de alta calidad, diseñada para el estilo urbano moderno
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Product Image */}
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-medium tracking-wider">
                    {product.category}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-xl font-bold tracking-wider mb-2">
                    {product.title}
                  </h3>
                  <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    {product.description}
                  </p>
                  
                  {/* CTA Button */}
                  <button className="mt-4 bg-white text-gray-900 px-6 py-2 rounded-full font-medium text-sm tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300 transform translate-y-4 group-hover:translate-y-0 hover:bg-gray-100">
                    Ver Colección
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium tracking-wider hover:bg-gray-800 transition-colors duration-300 transform hover:scale-105">
            VER TODAS LAS COLECCIONES
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProductSection