import { Link } from "react-router-dom";
import React from 'react'

const Hero = () => (
  <section className="relative">
    {/* Banner principal con imagen de fondo */}
    <div className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden bg-black">
      <img 
        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80" 
        alt="Moda" 
        className="absolute inset-0 w-full h-full object-cover opacity-70" 
      />
      <div className="relative z-10 text-center text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">EGYPTIAN BEATLES</h1>
        <p className="text-lg md:text-xl mb-6 drop-shadow">Descubre la nueva colección</p>
        <Link to="/productos">
          <button className="bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300">
            Explorar Colección
          </button>
        </Link>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    </div>
    
    {/* Grid de categorías/productos destacados */}
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Categoría 1 */}
          <Link to="/productos?category=Pantalones" className="group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 group-hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=80" 
                alt="Pantalones" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-900">Pantalones</p>
          </Link>
          
          {/* Categoría 2 */}
          <Link to="/productos?category=Camisetas" className="group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 group-hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80" 
                alt="Camisetas" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-900">Camisetas</p>
          </Link>
          
          {/* Categoría 3 */}
          <Link to="/productos?category=Vestidos" className="group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 group-hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80" 
                alt="Vestidos" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-900">Vestidos</p>
          </Link>
          
          {/* Categoría 4 */}
          <Link to="/productos?category=Abrigos" className="group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 group-hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80" 
                alt="Abrigos" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-900">Abrigos</p>
          </Link>
          
          {/* Categoría 5 */}
          <Link to="/productos" className="group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 group-hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80" 
                alt="Accesorios" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-900">Accesorios</p>
          </Link>
          
          {/* Categoría 6 */}
          <Link to="/productos" className="group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 group-hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80" 
                alt="Calzado" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-900">Calzado</p>
          </Link>
        </div>
      </div>
    </div>
  </section>
)

export default Hero