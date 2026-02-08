export type Role = 'BUYER' | 'SELLER' | 'ADMIN';

export type StoreStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type OrderStatus = 'PENDING' | 'PAID' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: Role;
}

export interface Store {
  id: string;
  userId: string;
  businessName: string;
  legalName: string;
  nit: string;
  bankAccount: string;
  status: StoreStatus;
}

export interface ProductVariants {
  grind: string[];
  size: string[];
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  origin?: string;
  variety?: string;
  tastingNotes?: string;
  preparation?: string;
  imageUrl?: string;
  variants?: ProductVariants;
  active: boolean;
}

export interface ProductWithStore extends Product {
  store: Store;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: { grind: string; size: string };
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  variant?: { grind: string; size: string };
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyer: User;
  storeId: string;
  store: Store;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  commission: number;
  total: number;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPhone: string;
  paymentStatus: string;
  transactionId?: string;
  createdAt: string;
  items: OrderItem[];
}
