import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Cargar carrito al iniciar
  // En el useEffect de carga del carrito
  useEffect(() => {
    const loadCart = async () => {
      console.log('Usuario completo:', user); // 👈 Agrega esto
      console.log('user.id:', user?.id); // 👈 Y esto
      
      if (user?.id) {
        // Si hay usuario, cargar desde base de datos
        const dbCart = await loadCartFromDatabase(user.id);
        if (dbCart.length > 0) {
          setCartItems(dbCart);
        } else {
          // Si no hay carrito en DB, usar localStorage como respaldo
          const savedCart = localStorage.getItem('cartItems');
          if (savedCart) {
            const localCart = JSON.parse(savedCart);
            setCartItems(localCart);
            // Guardar en DB el carrito local
            if (localCart.length > 0) {
              await saveCartToDatabase(localCart, user.id);
            }
          }
        }
      } else {
        // Sin usuario, usar solo localStorage
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            setCartItems(parsedCart);
          } catch (error) {
            console.error('Error parsing cart from localStorage:', error);
            localStorage.removeItem('cartItems');
          }
        }
      }
    };
    
    loadCart();
  }, [user]);

  // Guardar carrito cuando cambie (solo si no está cargando)
  // Este useEffect se ejecuta cada vez que cambia cartItems
  useEffect(() => {
    if (!isLoading && cartItems.length >= 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      // Si hay usuario, también guardar en base de datos
      if (user?.id) {
        saveCartToDatabase(cartItems, user.id); // 👈 Esto se ejecuta automáticamente
      }
    }
  }, [cartItems, user, isLoading]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    console.log('Eliminando producto:', productId); // 👈 Agrega esto
    console.log('Carrito antes:', cartItems); // 👈 Y esto
    
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== productId);
      console.log('Carrito después:', newItems); // 👈 Y esto
      return newItems;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isCartOpen,
    toggleCart,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};


// Para usuarios no autenticados: localStorage
// Para usuarios autenticados: base de datos + localStorage como backup

const saveCartToDatabase = async (cartItems, userId) => {
  if (!userId) {
    console.log('No userId provided, skipping database save');
    return;
  }
  
  if (!Array.isArray(cartItems)) {
    console.error('cartItems is not an array:', cartItems);
    return;
  }

  try {
    console.log('Saving to database:', { userId, cartItems }); // Debug
    
    const { data, error } = await supabase
      .from('user_carts')
      .upsert({ 
        user_id: userId, 
        cart_items: cartItems,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });
    
    if (error) {
      console.error('Supabase error details:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
    } else {
      console.log('Cart saved successfully to database');
    }
  } catch (error) {
    console.error('Catch block error:', error);
    console.error('Error type:', typeof error);
    console.error('Error details:', JSON.stringify(error, null, 2));
  }
};

const loadCartFromDatabase = async (userId) => {
  if (!userId) {
    console.log('No userId provided for loading cart');
    return [];
  }
  
  try {
    console.log('Loading cart for userId:', userId); // Debug
    
    const { data, error } = await supabase
      .from('user_carts')
      .select('cart_items')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('No cart found in database for user:', userId);
      } else {
        console.error('Error loading cart:', error);
      }
      return [];
    }
    
    console.log('Cart loaded from database:', data?.cart_items);
    return data?.cart_items || [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};