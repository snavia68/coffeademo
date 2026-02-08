import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { formatCOP } from '@/data/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Order } from '@/types/coffea';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, tax, total, clearCart, currentStoreId } = useCart();
  const { user } = useAuth();
  const { stores, addOrder } = useData();
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', address: '', city: '', phone: '' });

  if (!user || items.length === 0) {
    navigate('/cart');
    return null;
  }

  const store = stores.find(s => s.id === currentStoreId);
  const commission = Math.round(subtotal * 0.015);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.city || !form.phone) {
      toast.error('Completa todos los campos');
      return;
    }
    setIsProcessing(true);

    // Simulate payment (80% success)
    await new Promise(r => setTimeout(r, 2000));
    const success = Math.random() > 0.2;

    if (!success) {
      setIsProcessing(false);
      toast.error('Pago rechazado. Intenta de nuevo.');
      return;
    }

    const order: Order = {
      id: `o${Date.now()}`,
      orderNumber: `ORD-${String(Date.now()).slice(-6)}`,
      buyerId: user.id,
      buyer: user,
      storeId: currentStoreId!,
      store: store!,
      status: 'PAID',
      subtotal, tax, commission, total,
      shippingName: form.name,
      shippingAddress: form.address,
      shippingCity: form.city,
      shippingPhone: form.phone,
      paymentStatus: 'completed',
      transactionId: `TXN-${Date.now()}`,
      createdAt: new Date().toISOString(),
      items: items.map((item, i) => ({
        id: `oi${Date.now()}_${i}`,
        orderId: `o${Date.now()}`,
        productId: item.product.id,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
        variant: item.selectedVariant,
      })),
    };

    addOrder(order);
    clearCart();
    toast.success('¡Pago exitoso!');
    console.log(`[EMAIL MOCK] To: ${user.email} | Subject: Confirmación de orden ${order.orderNumber}`);
    navigate(`/order-confirmation/${order.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="font-display font-semibold text-lg mb-4">Datos de Envío</h2>
              <div className="space-y-4">
                <div><label className="text-sm font-medium block mb-1">Nombre completo</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                <div><label className="text-sm font-medium block mb-1">Dirección</label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required placeholder="Calle 100 #15-20" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium block mb-1">Ciudad</label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required placeholder="Bogotá" /></div>
                  <div><label className="text-sm font-medium block mb-1">Teléfono</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required placeholder="3201234567" /></div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="font-display font-semibold text-lg mb-4">Resumen de Compra</h2>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span className="font-medium">{formatCOP(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6 h-fit sticky top-20">
            <h2 className="font-display font-semibold text-lg mb-4">Total</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCOP(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">IVA (19%)</span><span>{formatCOP(tax)}</span></div>
              <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold text-base">
                <span>Total</span><span className="text-primary">{formatCOP(total)}</span>
              </div>
            </div>
            <Button type="submit" className="w-full mt-6" disabled={isProcessing}>
              {isProcessing ? 'Procesando pago...' : 'Confirmar y Pagar'}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">Pago simulado (80% éxito)</p>
          </div>
        </form>
      </main>
    </div>
  );
}
