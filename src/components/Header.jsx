import { useState } from 'react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 z-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Left Navigation */}
            <nav className="hidden md:flex space-x-6 lg:space-x-8">
              <div className="relative group">
                <button className="text-gray-700 hover:text-gray-900 font-medium flex items-center text-sm lg:text-base">
                  Hombre
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <div className="relative group">
                <button className="text-gray-700 hover:text-gray-900 font-medium flex items-center text-sm lg:text-base">
                  Mujer
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium text-sm lg:text-base">Accesorios</a>
              <a href="#" className="text-red-600 hover:text-red-700 font-medium text-sm lg:text-base">Sale</a>
            </nav>
            
            {/* Logo - Centrado perfecto */}
            <div className="flex items-center space-x-2 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
              <span className="text-xl sm:text-2xl">👑</span>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-gray-900 tracking-wider">EGYPTIAN</div>
                <div className="text-xs text-gray-600 tracking-widest hidden sm:block">B E A T L E S</div>
              </div>
            </div>
            
            {/* Right Section - Icons */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Contacto solo en desktop grande */}
              <a href="#" className="hidden lg:block text-gray-700 hover:text-gray-900 font-medium text-sm lg:text-base mr-4">Contacto</a>
              
              {/* Icons */}
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 ease-in-out relative transform hover:scale-105"
                onClick={() => setIsCartOpen(true)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="8" cy="21" r="1"></circle>
                  <circle cx="19" cy="21" r="1"></circle>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-200 ease-in-out">0</span>
              </button>
            </div>
          </div>

          {/* Search Section - Solo el buscador */}
          {isSearchOpen && (
            <div className="border-t border-gray-200 bg-white py-4 animate-in slide-in-from-top duration-300 ease-out">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-transparent outline-none text-gray-700 placeholder-gray-500 transition-all duration-200 ease-in-out"
                    autoFocus
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </button>
                </div>
                <button 
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-300 transition-all duration-200 ease-in-out font-medium transform hover:scale-105"
                  onClick={() => {
                    console.log('Buscar productos');
                  }}
                >
                  Buscar
                </button>
                <button 
                  className="p-3 text-gray-400 hover:text-gray-600 transition-all duration-200 ease-in-out transform hover:scale-110 hover:rotate-90"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Navigation Menu - Desde abajo con diseño original */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ease-out"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          
          {/* Menu Panel desde abajo - manteniendo diseño original */}
          <div 
            className="fixed bottom-0 left-0 right-0 bg-white z-50 md:hidden transform transition-transform duration-300 ease-out"
            style={{
              transform: isMenuOpen ? 'translateY(0)' : 'translateY(100%)'
            }}
          >
            {/* Botón de cerrar en la esquina superior derecha */}
            <div className="flex justify-end p-4">
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="px-6 pb-6">
              <div className="space-y-1">
                <div className="flex items-center justify-between px-4 py-4 text-gray-900 font-medium text-lg border-b border-gray-100">
                  <span>Café</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="flex items-center justify-between px-4 py-4 text-gray-900 font-medium text-lg border-b border-gray-100">
                  <span>Accesorios</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="px-4 py-4 text-gray-900 font-medium text-lg border-b border-gray-100">
                  Regalos
                </div>
                <div className="px-4 py-4 text-gray-900 font-medium text-lg border-b border-gray-100">
                  Sale
                </div>
                <div className="px-4 py-4 text-gray-900 font-medium text-lg border-b border-gray-100">
                  Nosotros
                </div>
                
                {/* Secciones adicionales */}
                <div className="pt-4 space-y-1">
                  <div className="px-4 py-3 text-gray-700 text-base">
                    Educación
                  </div>
                  <div className="px-4 py-3 text-gray-700 text-base">
                    Tiendas
                  </div>
                  <div className="px-4 py-3 text-gray-700 text-base">
                    Venta Mayorista
                  </div>
                  <div className="px-4 py-3 text-gray-700 text-base">
                    Seguimiento
                  </div>
                </div>
                
                {/* Sección de cuenta en la parte inferior */}
                <div className="border-t border-gray-200 pt-4 mt-6">
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-gray-900 font-medium">Cuenta</span>
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black transition-all duration-700 ease-out z-40"
            style={{
              opacity: isCartOpen ? '0.5' : '0',
              visibility: isCartOpen ? 'visible' : 'hidden'
            }}
            onClick={() => setIsCartOpen(false)}
          ></div>
          
          {/* Cart Panel */}
          <div 
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-all duration-700 ease-out"
            style={{
              transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
              opacity: isCartOpen ? '1' : '0'
            }}
          >
            {/* Cart Header */}
            <div 
              className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white transform transition-all duration-500 ease-out"
              style={{
                transform: isCartOpen ? 'translateY(0)' : 'translateY(-20px)',
                opacity: isCartOpen ? '1' : '0',
                transitionDelay: isCartOpen ? '200ms' : '0ms'
              }}
            >
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gray-100 rounded-full transform transition-all duration-300 ease-out hover:scale-110">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Tu Carrito</h2>
                  <span className="text-sm text-gray-500">0 productos</span>
                </div>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 ease-in-out transform hover:scale-110 hover:rotate-90"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 flex flex-col h-full">
              {/* Empty Cart */}
              <div 
                className="flex-1 flex flex-col items-center justify-center p-6 text-center transform transition-all duration-500 ease-out"
                style={{
                  transform: isCartOpen ? 'translateY(0)' : 'translateY(30px)',
                  opacity: isCartOpen ? '1' : '0',
                  transitionDelay: isCartOpen ? '400ms' : '0ms'
                }}
              >
                <div 
                  className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 transform transition-all duration-500 ease-out hover:scale-105"
                  style={{
                    transform: isCartOpen ? 'scale(1) rotate(0deg)' : 'scale(0.8) rotate(-10deg)',
                    transitionDelay: isCartOpen ? '600ms' : '0ms'
                  }}
                >
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                  </svg>
                </div>
                <h3 
                  className="text-lg font-medium text-gray-900 mb-2 transform transition-all duration-500 ease-out"
                  style={{
                    transform: isCartOpen ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isCartOpen ? '1' : '0',
                    transitionDelay: isCartOpen ? '700ms' : '0ms'
                  }}
                >
                  El carrito está vacío
                </h3>
                <p 
                  className="text-gray-500 mb-8 leading-relaxed transform transition-all duration-500 ease-out"
                  style={{
                    transform: isCartOpen ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isCartOpen ? '1' : '0',
                    transitionDelay: isCartOpen ? '800ms' : '0ms'
                  }}
                >
                  Agrega algunos productos para comenzar tu compra
                </p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 ease-in-out font-medium transform hover:scale-105 hover:shadow-lg"
                  style={{
                    transform: isCartOpen ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                    opacity: isCartOpen ? '1' : '0',
                    transitionDelay: isCartOpen ? '900ms' : '0ms'
                  }}
                >
                  Seguir comprando
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Header