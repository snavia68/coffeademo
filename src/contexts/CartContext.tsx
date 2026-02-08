import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, Product } from '@/types/coffea';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number, variant?: { grind: string; size: string }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  currentStoreId: string | null;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('coffea_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const save = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('coffea_cart', JSON.stringify(newItems));
  };

  const currentStoreId = items.length > 0 ? items[0].product.storeId : null;

  const addItem = useCallback((product: Product, quantity: number, variant?: { grind: string; size: string }) => {
    setItems(prev => {
      if (prev.length > 0 && prev[0].product.storeId !== product.storeId) {
        toast.error('Solo puedes agregar productos de una misma tienda por orden');
        return prev;
      }
      if (quantity > product.stock) {
        toast.error('Stock insuficiente');
        return prev;
      }
      const existing = prev.find(i => i.product.id === product.id);
      let newItems: CartItem[];
      if (existing) {
        newItems = prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity, selectedVariant: variant || i.selectedVariant } : i);
      } else {
        newItems = [...prev, { product, quantity, selectedVariant: variant }];
      }
      localStorage.setItem('coffea_cart', JSON.stringify(newItems));
      toast.success('Producto agregado al carrito');
      return newItems;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => {
      const newItems = prev.filter(i => i.product.id !== productId);
      localStorage.setItem('coffea_cart', JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems(prev => {
      const newItems = quantity <= 0
        ? prev.filter(i => i.product.id !== productId)
        : prev.map(i => i.product.id === productId ? { ...i, quantity } : i);
      localStorage.setItem('coffea_cart', JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => save([]), []);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.19);
  const total = subtotal + tax;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, tax, total, currentStoreId }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
