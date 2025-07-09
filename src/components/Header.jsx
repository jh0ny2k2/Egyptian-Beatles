import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { supabase } from '../supabaseClient';

const menuItems = [
  { label: 'Mujer', sub: ['Vestidos', 'Tops', 'Pantalones', 'Faldas', 'Abrigos', 'Zapatos', 'Accesorios'] },
  { label: 'Hombre', sub: ['Camisetas', 'Camisas', 'Pantalones', 'Chaquetas', 'Zapatos', 'Accesorios'] },
  { label: 'Sale', badge: 'SALE' },
  { label: 'Novedades', badge: 'NUEVO' },
  { label: 'Nosotros', sub: ['Sostenibilidad', 'Contacto'] }
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [submenu, setSubmenu] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const { cartItems, isCartOpen, toggleCart, removeFromCart, updateQuantity, getCartTotal, getCartItemsCount } = useCart();
  const navigate = useNavigate();

  // Función para manejar la navegación a productos con categoría
  const handleCategoryClick = (category) => {
    navigate(`/productos?category=${category}`);
    setMenuOpen(false);
    setSubmenu(null);
  };

  // Función para manejar la navegación a productos con badge
  const handleBadgeClick = (badge) => {
    navigate(`/productos?badge=${badge}`);
    setMenuOpen(false);
    setSubmenu(null);
  };

  // Actualizamos la función para manejar la navegación a las secciones de Nosotros
  const handleAboutClick = (section) => {
    // Ahora navegamos directamente a la ruta correspondiente
    navigate(`/${section.toLowerCase()}`);
    setMenuOpen(false);
    setSubmenu(null);
  };

  // Función para buscar sugerencias en tiempo real
  const fetchSearchSuggestions = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('productos')
        .select('id, nombre, category, imagen, price')
        .or(`nombre.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(5);

      if (error) throw error;

      setSearchSuggestions(data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSearchSuggestions([]);
    }
  };

  // Función para manejar cambios en el input de búsqueda
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    fetchSearchSuggestions(value);
  };

  // Función para seleccionar una sugerencia
  const handleSuggestionClick = (suggestion) => {
    navigate(`/producto/${suggestion.id}`);
    setSearchOpen(false);
    setSearchInput('');
    setSearchSuggestions([]);
    setShowSuggestions(false);
  };

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/productos?search=${searchInput}`);
      setSearchOpen(false);
      setSearchInput('');
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

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
        <Link to="/"><div className="flex-1 flex justify-center items-center">
          <span className="font-extrabold text-2xl text-gray-900 tracking-tight">Egyptian<span className="font-normal mr-1">Beatles</span></span>
        </div></Link>
        {/* Right: Cart + Login */}
        <div className="flex items-center space-x-2">
          {/* Botón de administrador - solo visible para usuarios con rol admin */}
          {isLoggedIn && user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className="ml-2 flex items-center px-3 py-2 rounded-lg bg-white text-black  hover:bg-gray-300 transition-colors"
              aria-label="Panel de administración"
              title="Panel de administración"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden sm:block ml-2 text-sm font-medium">Admin</span>
            </Link>
          )}
          
          <button className="text-gray-700 focus:outline-none relative" onClick={toggleCart}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{getCartItemsCount()}</span>
          </button>
          {/* Botón de usuario - cambia según el estado de autenticación */}
          <Link 
            to={isLoggedIn ? "/perfil" : "/login"} 
            className="ml-2 flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors" 
            aria-label={isLoggedIn ? `Perfil de ${user?.nombre}` : "Iniciar sesión"}
            title={isLoggedIn ? `Hola, ${user?.nombre}` : "Iniciar sesión"}
          >
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {user?.nombre?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user?.nombre}
                </span>
              </div>
            ) : (
              <img src="/src/assets/img/usuario.png" className="w-6 h-6" alt="Iniciar sesión" />
            )}
          </Link>
        </div>
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:justify-end md:items-start">
          <div className="bg-black bg-opacity-40 w-full h-full absolute top-0 left-0" onClick={toggleCart}></div>
          <aside className="relative w-full max-w-md md:w-96 h-full md:h-[95vh] bg-white shadow-xl flex flex-col rounded-none md:rounded-xl m-0 md:m-4 z-10 animate-slideInUp">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
              onClick={toggleCart}
              aria-label="Cerrar carrito"
            >
              ×
            </button>
            
            {cartItems.length === 0 ? (
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
                <button 
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors max-w-xs"
                  onClick={toggleCart}
                >
                  Seguir comprando
                </button>
              </div>
            ) : (
              <>
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold">Carrito de compras</h2>
                  <p className="text-gray-600">{getCartItemsCount()} artículos</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  {cartItems.map((item, index) => (
                    <div key={`${item.id}-${item.selectedSize || 'no-size'}-${item.selectedColor || 'no-color'}-${index}`} className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                      <img 
                        src={item.image || item.imagen} 
                        alt={item.name || item.nombre} 
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{item.name || item.nombre}</h3>
                        <p className="text-gray-600 text-xs">{item.category}</p>
                        {/* Mostrar variaciones seleccionadas */}
                        {(item.selectedSize || item.selectedColor) && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.selectedSize && <span>Talla: {item.selectedSize}</span>}
                            {item.selectedSize && item.selectedColor && <span> | </span>}
                            {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold">
                            <span className="font-bold">
                              {(() => {
                                let price = item.price;
                                
                                // Si el precio ya es una cadena con símbolo de moneda, mostrarlo tal como está
                                if (typeof price === 'string' && (price.includes('€') || price.includes('$'))) {
                                  return price;
                                }
                                
                                // Si es una cadena sin símbolo, limpiar y convertir a número
                                if (typeof price === 'string') {
                                  price = price.replace(/[€£¥₹]/g, '').replace(/\s/g, '');
                                  price = parseFloat(price);
                                }
                                
                                // Si es un número válido, formatear con símbolo de euro
                                if (!isNaN(price) && price >= 0) {
                                  return `€${price.toFixed(2)}`;
                                }
                                
                                // Fallback si el precio no es válido
                                return '€0.00';
                              })()} 
                            </span>
                          </span>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                        className="text-gray-400 hover:text-red-500 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-xl">{getCartTotal().toFixed(2)}€</span>
                  </div>
                  <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors mb-2">
                    Proceder al pago
                  </button>
                  <button 
                    onClick={toggleCart}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Seguir comprando
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {/* Search Modal con autocompletado */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="max-w-2xl mx-auto pt-20 px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Buscar</h2>
              <button 
                onClick={() => {
                  setSearchOpen(false);
                  setSearchInput('');
                  setSearchSuggestions([]);
                  setShowSuggestions(false);
                }} 
                className="text-gray-500 hover:text-black"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="relative">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="¿Qué estás buscando?"
                  className="w-full text-xl py-4 border-b-2 border-gray-300 focus:border-black focus:outline-none"
                  autoFocus
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  onFocus={() => searchInput.length >= 2 && setShowSuggestions(true)}
                />
                <button 
                  type="submit" 
                  className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Buscar
                </button>
              </form>

              {/* Sugerencias de autocompletado con diseño de dos por fila */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white rounded-lg mt-2 max-h-[calc(100vh-200px)] overflow-y-auto z-10">
                  <div className="p-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      {searchSuggestions.map((suggestion, index) => (
                        <div
                          key={suggestion.id}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="group flex flex-col items-center p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-all duration-200  border-gray-100 hover:border-gray-200"
                        >
                          {/* Imagen del producto */}
                          <div className="w-48 h-48 rounded-lg overflow-hidden mb-2 bg-gray-100">
                            <img
                              src={suggestion.imagen || 'https://via.placeholder.com/64x64?text=No+Image'}
                              alt={suggestion.nombre}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                              }}
                            />
                          </div>
                          
                          {/* Información del producto */}
                          <div className="text-center">
                            <h4 className="font-medium text-gray-900 text-xs mb-1 line-clamp-2 leading-tight">
                              {suggestion.nombre}
                            </h4>
                            <p className="text-sm font-semibold text-gray-900">
                              {suggestion.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mensaje cuando no hay sugerencias */}
              {showSuggestions && searchInput.length >= 2 && searchSuggestions.length === 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 p-6 text-center z-10">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-medium text-gray-900 mb-1">No se encontraron productos</h3>
                    <p className="text-gray-500 text-sm">Intenta con otros términos de búsqueda</p>
                  </div>
                </div>
              )}
            </div>
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
                    onClick={() => {
                      if (item.sub) {
                        setSubmenu(idx);
                      } else if (item.badge) {
                        // Para elementos con badge, navegar usando el badge
                        handleBadgeClick(item.badge);
                      } else {
                        // Para otros elementos sin submenú ni badge
                        setMenuOpen(false);
                      }
                    }}
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
                    <button 
                      key={subitem} 
                      className="text-base py-1 px-2 rounded hover:bg-gray-100 block text-left w-full"
                      onClick={() => {
                        // Si estamos en el submenú de Nosotros (que es el índice 4 en menuItems)
                        if (submenu === 4) {
                          handleAboutClick(subitem);
                        } else {
                          handleCategoryClick(subitem);
                        }
                      }}
                    >
                      {subitem}
                    </button>
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