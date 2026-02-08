import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { useCart } from '@/contexts/CartContext';
import { formatCOP } from '@/data/mock-data';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, tax, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-display font-bold mb-4">Tu carrito está vacío</h1>
        <p className="text-muted-foreground mb-6">Explora nuestro catálogo de café colombiano</p>
        <Button onClick={() => navigate('/')}>Ver Productos</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-display font-bold mb-8">Carrito de Compras</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.product.id} className="bg-card rounded-lg border border-border p-4 flex gap-4 animate-fade-in">
                <img src={item.product.imageUrl || '/placeholder.svg'} alt={item.product.name} className="w-20 h-20 rounded-md object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{item.product.name}</h3>
                  {item.selectedVariant && (
                    <p className="text-xs text-muted-foreground">{item.selectedVariant.grind} · {item.selectedVariant.size}</p>
                  )}
                  <p className="font-medium text-primary mt-1">{formatCOP(item.product.price)}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 rounded border border-border hover:bg-muted"><Minus className="w-3 h-3" /></button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 rounded border border-border hover:bg-muted"><Plus className="w-3 h-3" /></button>
                    </div>
                    <button onClick={() => removeItem(item.product.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{formatCOP(item.product.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-lg border border-border p-6 h-fit sticky top-20">
            <h2 className="font-display font-semibold text-lg mb-4">Resumen</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCOP(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">IVA (19%)</span><span>{formatCOP(tax)}</span></div>
              <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold text-base">
                <span>Total</span><span className="text-primary">{formatCOP(total)}</span>
              </div>
            </div>
            <Button className="w-full mt-6" onClick={() => navigate('/checkout')}>
              Proceder al Pago
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
