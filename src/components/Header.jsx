import React, { useState } from 'react'

const menuItems = [
  { label: 'Mujer', sub: ['Vestidos', 'Tops', 'Pantalones', 'Faldas', 'Abrigos', 'Zapatos', 'Accesorios'] },
  { label: 'Hombre', sub: ['Camisetas', 'Camisas', 'Pantalones', 'Chaquetas', 'Zapatos', 'Accesorios'] },
  { label: 'Sale' },
  { label: 'Novedades' },
  { label: 'Nosotros', sub: ['Tiendas', 'Sostenibilidad', 'Contacto'] }
]

function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false)
  const [submenu, setSubmenu] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Hamburger + Search */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-700 focus:outline-none" onClick={() => { setMenuOpen(true); setSubmenu(null); }}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button className="text-gray-700 focus:outline-none" onClick={() => setSearchOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {/* Center: Logo */}
        <div className="flex-1 flex justify-center items-center">
          <span className="font-extrabold text-2xl text-gray-900 tracking-tight">Egyptian<span className="font-normal mr-1">Beatles</span></span>
        </div>
        {/* Right: Cart */}
        <div className="flex items-center">
          <button className="text-gray-700 focus:outline-none relative" onClick={() => setCartOpen(true)}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
          </button>
        </div>
      </div>

      {/* Cart Modal */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:justify-end md:items-start">
          <div className="bg-black bg-opacity-40 w-full h-full absolute top-0 left-0" onClick={() => setCartOpen(false)}></div>
          <aside className="relative w-full max-w-md md:w-96 h-full md:h-[95vh] bg-white shadow-xl flex flex-col rounded-none md:rounded-xl m-0 md:m-4 z-10 animate-slideInUp">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
              onClick={() => setCartOpen(false)}
              aria-label="Cerrar carrito"
            >
              ×
            </button>
            <div className="flex-1 flex flex-col items-center justify-center text-gray-700 p-8">
              <div className="mb-6 flex flex-col items-center">
                <div className="relative">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-1.5 py-0.5 font-bold">0</span>
                </div>
              </div>
              <span className="text-center text-lg mb-6">El carrito está vacío</span>
              <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors max-w-xs">
                Seguir comprando
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="max-w-2xl mx-auto pt-20 px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Buscar</h2>
              <button onClick={() => setSearchOpen(false)} className="text-gray-500 hover:text-black">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              className="w-full text-xl py-4 border-b-2 border-gray-300 focus:border-black focus:outline-none"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Drawer menu */}
      {menuOpen && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-end md:justify-center transition-transform duration-300 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-10" onClick={() => { setMenuOpen(false); setSubmenu(null); }}></div>
          {/* Drawer content */}
          <div className="relative z-10 w-11/12 max-w-md bg-white rounded-t-xl md:rounded-xl shadow-lg p-6">
            <button className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow p-2" onClick={() => { setMenuOpen(false); setSubmenu(null); }}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <nav className="flex flex-col space-y-2 mt-6">
              {submenu === null ? (
                menuItems.map((item, idx) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center justify-between text-left text-lg font-medium py-2 px-2 rounded hover:bg-gray-100 focus:outline-none"
                    onClick={() => item.sub ? setSubmenu(idx) : setMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    {item.sub && (
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                ))
              ) : (
                <>
                  <button className="mb-4 text-gray-500 flex items-center" onClick={() => setSubmenu(null)}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver
                  </button>
                  {menuItems[submenu].sub.map((subitem) => (
                    <a key={subitem} href="#" className="text-base py-1 px-2 rounded hover:bg-gray-100 block">{subitem}</a>
                  ))}
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
