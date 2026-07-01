'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  logo?: string;
  domain?: string;
  da?: number;
  dr?: number;
  traffic?: number;
  category?: string;
  type: 'media' | 'package' | 'backlink';
  discount?: number; // package discount
}

export interface VoucherInfo {
  code: string;
  type: 'PERCENT' | 'NOMINAL';
  value: number;
  minSpend: number;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  voucher: VoucherInfo | null;
  applyVoucher: (voucher: VoucherInfo | null) => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [voucher, setVoucher] = useState<VoucherInfo | null>(null);

  // Load theme and cart on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', prefersDark);
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      // Check if already in cart
      if (prev.some((i) => i.id === item.id && i.type === item.type)) {
        return prev;
      }
      const updated = [...prev, item];
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    setVoucher(null);
    localStorage.removeItem('cart');
  };

  const applyVoucher = (v: VoucherInfo | null) => {
    setVoucher(v);
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price, 0);
  
  let cartDiscount = 0;
  if (voucher) {
    if (cartSubtotal >= voucher.minSpend) {
      if (voucher.type === 'PERCENT') {
        cartDiscount = Math.round((cartSubtotal * voucher.value) / 100);
      } else {
        cartDiscount = Math.round(voucher.value);
      }
    }
  }
  
  const cartTotal = Math.round(Math.max(0, cartSubtotal - cartDiscount));

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        voucher,
        applyVoucher,
        cartSubtotal,
        cartDiscount,
        cartTotal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
