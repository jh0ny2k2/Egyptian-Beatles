import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Exportamos solo el componente CartProvider desde este archivo
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Cargar carrito al iniciar
  // En el useEffect de carga del carrito
  useEffect(() => {
    const loadCart = async () => {
      console.log('Usuario completo:', user);
      console.log('user.id:', user?.id);
      
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
      
      // ✅ AGREGAR ESTA LÍNEA - Establecer isLoading como false después de cargar
      setIsLoading(false);
    };
    
    loadCart();
  }, [user]);

  // Guardar carrito cuando cambie (solo si no está cargando)
  // Este useEffect se ejecuta cada vez que cambia cartItems
  useEffect(() => {
    const syncCart = async () => {
      if (isLoading) return;
      
      // Guardar en localStorage siempre
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      // Si hay usuario, también guardar en base de datos
      if (user?.id) {
        try {
          await saveCartToDatabase(cartItems, user.id);
          console.log('Carrito sincronizado con la base de datos');
        } catch (error) {
          console.error('Error al sincronizar el carrito:', error);
        }
      }
    };
    
    syncCart();
  }, [cartItems, user, isLoading]);

  const addToCart = (product, quantity = 1) => {
    // Normalizar el producto antes de añadirlo al carrito
    const normalizedProduct = {
      id: product.id,
      name: product.name || product.nombre,
      price: product.price || product.precio,
      image: product.image || product.imagen,
      category: product.category || product.categoria,
      selectedSize: product.selectedSize,
      selectedColor: product.selectedColor,
      quantity: quantity
    };

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.id === normalizedProduct.id && 
        item.selectedSize === normalizedProduct.selectedSize && 
        item.selectedColor === normalizedProduct.selectedColor
      );
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === normalizedProduct.id && 
          item.selectedSize === normalizedProduct.selectedSize && 
          item.selectedColor === normalizedProduct.selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, normalizedProduct];
      }
    });
  };

  const removeFromCart = (productId, selectedSize = null, selectedColor = null) => {
    console.log('Eliminando producto:', { productId, selectedSize, selectedColor });
    
    if (!productId) {
      console.error('ID de producto inválido:', productId);
      return;
    }
    
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => {
        // Si no se especifican variaciones, eliminar por ID solamente
        if (!selectedSize && !selectedColor) {
          return item.id !== productId;
        }
        // Si se especifican variaciones, eliminar el item exacto
        return !(
          item.id === productId && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
        );
      });
      console.log('Carrito después:', newItems);
      return newItems;
    });
  };

  const updateQuantity = (productId, quantity, selectedSize = null, selectedColor = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item => {
        // Si no se especifican variaciones, actualizar por ID solamente
        if (!selectedSize && !selectedColor) {
          return item.id === productId ? { ...item, quantity } : item;
        }
        // Si se especifican variaciones, actualizar el item exacto
        return (
          item.id === productId && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
        ) ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // Normalizar el precio eliminando símbolos de moneda y convirtiendo a número
      let price = item.price;
      if (typeof price === 'string') {
        // Eliminar símbolos de moneda comunes y espacios
        price = price.replace(/[$€£¥₹]/g, '').replace(/\s/g, '');
        price = parseFloat(price);
      }
      
      // Validar que el precio sea un número válido
      if (isNaN(price) || price < 0) {
        console.warn('Precio inválido para el producto:', item);
        price = 0;
      }
      
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

// Exportamos el hook useCart desde aquí para que esté disponible
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

// Funciones auxiliares
const saveCartToDatabase = async (cartItems, userId) => {
  // Implementación mejorada que devuelve promesas
  if (!userId) {
    console.log('No userId provided, skipping database save');
    return Promise.resolve();
  }
  
  if (!Array.isArray(cartItems)) {
    console.error('cartItems is not an array:', cartItems);
    return Promise.reject(new Error('cartItems is not an array'));
  }

  try {
    console.log('Saving to database:', { userId, cartItems });
    
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
      return Promise.reject(error);
    } else {
      console.log('Cart saved successfully to database');
      return Promise.resolve(data);
    }
  } catch (error) {
    console.error('Catch block error:', error);
    return Promise.reject(error);
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