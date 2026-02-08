import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { useData } from '@/contexts/DataContext';
import { formatCOP } from '@/data/mock-data';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderConfirmation() {
  const { id } = useParams();
  const { orders } = useData();
  const order = orders.find(o => o.id === id);

  if (!order) return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="container mx-auto px-4 py-16 text-center"><p className="text-muted-foreground">Orden no encontrada</p></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-lg text-center">
        <CheckCircle className="w-16 h-16 text-sage mx-auto mb-4" />
        <h1 className="text-3xl font-display font-bold mb-2">¡Orden Confirmada!</h1>
        <p className="text-muted-foreground mb-6">Tu pedido ha sido procesado exitosamente</p>

        <div className="bg-card rounded-lg border border-border p-6 text-left space-y-3 mb-6">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Número de orden</span><span className="font-mono font-medium">{order.orderNumber}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total</span><span className="font-bold text-primary">{formatCOP(order.total)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Estado</span><span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs">{order.status}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Envío a</span><span>{order.shippingCity}</span></div>
        </div>

        <div className="flex gap-3 justify-center">
          <Link to="/mis-ordenes"><Button variant="outline">Ver Mis Órdenes</Button></Link>
          <Link to="/"><Button>Seguir Comprando</Button></Link>
        </div>
      </main>
    </div>
  );
}
