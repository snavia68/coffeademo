import { User, Store, Product, Order } from '@/types/coffea';

export const users: User[] = [
  { id: 'u1', email: 'admin@coffea.com', name: 'Admin Coffea', password: 'admin123', role: 'ADMIN' },
  { id: 'u2', email: 'juan@example.com', name: 'Juan Pérez', password: 'buyer123', role: 'BUYER' },
  { id: 'u3', email: 'maria@example.com', name: 'María González', password: 'buyer123', role: 'BUYER' },
  { id: 'u4', email: 'cafedelhuila@example.com', name: 'Carlos Rodríguez', password: 'seller123', role: 'SELLER' },
  { id: 'u5', email: 'tostadoraandina@example.com', name: 'Ana Martínez', password: 'seller123', role: 'SELLER' },
  { id: 'u6', email: 'cafeantioquia@example.com', name: 'Pedro López', password: 'seller123', role: 'SELLER' },
];

export const stores: Store[] = [
  { id: 's1', userId: 'u4', businessName: 'Café del Huila', legalName: 'Café del Huila S.A.S.', nit: '900123456-1', bankAccount: '1234567890', status: 'APPROVED' },
  { id: 's2', userId: 'u5', businessName: 'Tostadora Andina', legalName: 'Tostadora Andina Ltda.', nit: '900234567-2', bankAccount: '2345678901', status: 'APPROVED' },
  { id: 's3', userId: 'u6', businessName: 'Café de Antioquia', legalName: 'Café de Antioquia S.A.S.', nit: '900345678-3', bankAccount: '3456789012', status: 'PENDING' },
];

export const products: Product[] = [
  {
    id: 'p1', storeId: 's1', name: 'Café Geisha - Huila', active: true,
    description: 'Café de variedad Geisha cultivado en las montañas del Huila. Notas florales y cítricas con cuerpo medio.',
    price: 45000, stock: 50, origin: 'Huila', variety: 'Geisha',
    tastingNotes: 'Flores, cítricos, miel', preparation: 'Pour over, French press',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500',
    variants: { grind: ['Grano entero', 'Molido'], size: ['250g', '500g', '1kg'] },
  },
  {
    id: 'p2', storeId: 's1', name: 'Caturra Premium', active: true,
    description: 'Caturra de altura con proceso lavado. Perfecto balance entre acidez y dulzor.',
    price: 32000, stock: 80, origin: 'Huila', variety: 'Caturra',
    tastingNotes: 'Chocolate, caramelo, nuez', preparation: 'Espresso, Aeropress',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
    variants: { grind: ['Grano entero', 'Molido'], size: ['250g', '500g'] },
  },
  {
    id: 'p3', storeId: 's2', name: 'Blend Andino', active: true,
    description: 'Mezcla exclusiva de cafés colombianos con tostión media. Ideal para todo tipo de preparaciones.',
    price: 28000, stock: 100, origin: 'Varias regiones', variety: 'Blend',
    tastingNotes: 'Chocolate, caramelo, almendras', preparation: 'Cualquiera',
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500',
    variants: { grind: ['Grano entero', 'Molido'], size: ['250g', '500g', '1kg'] },
  },
  {
    id: 'p4', storeId: 's2', name: 'Typica Orgánico', active: true,
    description: 'Café Typica 100% orgánico certificado. Cultivado sin pesticidas ni fertilizantes químicos.',
    price: 38000, stock: 60, origin: 'Nariño', variety: 'Typica',
    tastingNotes: 'Frutas rojas, panela, limón', preparation: 'V60, Chemex',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500',
    variants: { grind: ['Grano entero', 'Molido'], size: ['250g', '500g'] },
  },
  {
    id: 'p5', storeId: 's2', name: 'Bourbon Especial', active: true,
    description: 'Bourbon rojo de proceso honey. Dulzor intenso y cuerpo cremoso.',
    price: 42000, stock: 45, origin: 'Tolima', variety: 'Bourbon',
    tastingNotes: 'Miel, chocolate, uva', preparation: 'Espresso, Moka',
    imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500',
    variants: { grind: ['Grano entero', 'Molido'], size: ['250g', '500g', '1kg'] },
  },
];

export const initialOrders: Order[] = [
  {
    id: 'o1', orderNumber: 'ORD-001', buyerId: 'u2', buyer: users[1],
    storeId: 's1', store: stores[0], status: 'DELIVERED',
    subtotal: 90000, tax: 17100, commission: 1350, total: 107100,
    shippingName: 'Juan Pérez', shippingAddress: 'Calle 123 #45-67',
    shippingCity: 'Bogotá', shippingPhone: '3001234567',
    paymentStatus: 'completed', transactionId: 'TXN-DEMO-001',
    createdAt: '2026-01-15T10:00:00Z',
    items: [{ id: 'oi1', orderId: 'o1', productId: 'p1', product: products[0], quantity: 2, price: 45000, variant: { grind: 'Grano entero', size: '500g' } }],
  },
  {
    id: 'o2', orderNumber: 'ORD-002', buyerId: 'u3', buyer: users[2],
    storeId: 's2', store: stores[1], status: 'PACKED',
    subtotal: 56000, tax: 10640, commission: 840, total: 66640,
    shippingName: 'María González', shippingAddress: 'Carrera 7 #32-16',
    shippingCity: 'Medellín', shippingPhone: '3109876543',
    paymentStatus: 'completed', transactionId: 'TXN-DEMO-002',
    createdAt: '2026-02-01T14:00:00Z',
    items: [{ id: 'oi2', orderId: 'o2', productId: 'p3', product: products[2], quantity: 2, price: 28000, variant: { grind: 'Molido', size: '500g' } }],
  },
];

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
}
