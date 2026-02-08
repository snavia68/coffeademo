import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { formatCOP } from '@/data/mock-data';
import { Package } from 'lucide-react';

const statusColors: Record<string, string> = {
  PENDING: 'bg-muted text-muted-foreground',
  PAID: 'bg-secondary text-secondary-foreground',
  PACKED: 'bg-secondary text-secondary-foreground',
  SHIPPED: 'bg-primary/10 text-primary',
  DELIVERED: 'bg-sage/20 text-sage',
  CANCELLED: 'bg-destructive/10 text-destructive',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagada',
  PACKED: 'Empacada',
  SHIPPED: 'Enviada',
  DELIVERED: 'Entregada',
  CANCELLED: 'Cancelada',
};

export default function MyOrders() {
  const { user } = useAuth();
  const { orders } = useData();
  const myOrders = orders.filter(o => o.buyerId === user?.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-display font-bold mb-8">Mis Órdenes</h1>

        {myOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tienes órdenes aún</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.map(order => (
              <div key={order.id} className="bg-card rounded-lg border border-border p-5 animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="font-mono text-sm font-medium">{order.orderNumber}</span>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('es-CO')}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.product.name} × {item.quantity}</span>
                      <span className="text-muted-foreground">{formatCOP(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border mt-3 pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatCOP(order.total)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Tienda: {order.store.businessName} · Envío a {order.shippingCity}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
