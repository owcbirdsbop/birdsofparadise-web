'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  sku: string;
  name: string;
  retail_price: number;
  web_stock: number;
  image_url: string | null;
  enrichment_category: string | null;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (sku: string, delta: number) => void;
  removeFromCart: (sku: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Restore cart from browser storage on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bop_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to browser storage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('bop_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.sku === item.sku);
      if (existing) {
        // Prevent adding more than what's available in web stock
        const nextQty = Math.min(item.web_stock, existing.quantity + 1);
        return prev.map((i) => (i.sku === item.sku ? { ...i, quantity: nextQty } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true); // Pop open the drawer automatically
  };

  const updateQuantity = (sku: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.sku === sku) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return { ...item, quantity: Math.min(item.web_stock, nextQty) };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (sku: string) => {
    setCart((prev) => prev.filter((i) => i.sku !== sku));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.retail_price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}