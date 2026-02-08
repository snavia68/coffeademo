import React, { createContext, useContext, useState, useCallback } from 'react';
import { Store, Product, Order, OrderStatus, StoreStatus } from '@/types/coffea';
import { stores as mockStores, products as mockProducts, initialOrders } from '@/data/mock-data';

interface DataContextType {
  stores: Store[];
  products: Product[];
  orders: Order[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addStore: (store: Store) => void;
  updateStoreStatus: (id: string, status: StoreStatus) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  getStoreByUserId: (userId: string) => Store | undefined;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [stores, setStores] = useState<Store[]>(mockStores);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const addProduct = useCallback((product: Product) => setProducts(p => [...p, product]), []);
  const updateProduct = useCallback((id: string, data: Partial<Product>) =>
    setProducts(p => p.map(pr => pr.id === id ? { ...pr, ...data } : pr)), []);
  const deleteProduct = useCallback((id: string) =>
    setProducts(p => p.map(pr => pr.id === id ? { ...pr, active: false } : pr)), []);
  const addStore = useCallback((store: Store) => setStores(s => [...s, store]), []);
  const updateStoreStatus = useCallback((id: string, status: StoreStatus) =>
    setStores(s => s.map(st => st.id === id ? { ...st, status } : st)), []);
  const addOrder = useCallback((order: Order) => {
    setOrders(o => [...o, order]);
    // Reduce stock
    order.items.forEach(item => {
      setProducts(p => p.map(pr => pr.id === item.productId ? { ...pr, stock: pr.stock - item.quantity } : pr));
    });
  }, []);
  const updateOrderStatus = useCallback((id: string, status: OrderStatus) =>
    setOrders(o => o.map(or => or.id === id ? { ...or, status } : or)), []);
  const getStoreByUserId = useCallback((userId: string) => stores.find(s => s.userId === userId), [stores]);

  return (
    <DataContext.Provider value={{ stores, products, orders, addProduct, updateProduct, deleteProduct, addStore, updateStoreStatus, addOrder, updateOrderStatus, getStoreByUserId }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
