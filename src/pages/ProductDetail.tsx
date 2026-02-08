import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useData } from '@/contexts/DataContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatCOP } from '@/data/mock-data';
import { MapPin, Coffee, ArrowLeft, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, stores } = useData();
  const { addItem } = useCart();
  const { user } = useAuth();

  const product = products.find(p => p.id === id);
  const store = product ? stores.find(s => s.id === product.storeId) : null;

  const [quantity, setQuantity] = useState(1);
  const [selectedGrind, setSelectedGrind] = useState(product?.variants?.grind[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.variants?.size[0] || '');

  if (!product) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Producto no encontrado</p>
      </div>
    </div>
  );

  const handleAddToCart = () => {
    if (!user) { toast.error('Inicia sesión para comprar'); navigate('/login'); return; }
    if (user.role !== 'BUYER') { toast.error('Solo compradores pueden comprar'); return; }
    const variant = product.variants ? { grind: selectedGrind, size: selectedSize } : undefined;
    addItem(product, quantity, variant);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img src={product.imageUrl || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">{store?.businessName}</p>
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-primary mb-6">{formatCOP(product.price)}</p>
            <p className="text-foreground/80 mb-6">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              {product.origin && <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /> {product.origin}</div>}
              {product.variety && <div className="flex items-center gap-2 text-muted-foreground"><Coffee className="w-4 h-4" /> {product.variety}</div>}
              {product.tastingNotes && <div className="col-span-2 text-muted-foreground">🫘 {product.tastingNotes}</div>}
              {product.preparation && <div className="col-span-2 text-muted-foreground">☕ {product.preparation}</div>}
            </div>

            {product.variants && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Tipo</label>
                  <div className="flex gap-2">
                    {product.variants.grind.map(g => (
                      <button key={g} onClick={() => setSelectedGrind(g)}
                        className={`px-4 py-2 rounded-md text-sm border transition-colors ${selectedGrind === g ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:border-primary'}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Tamaño</label>
                  <div className="flex gap-2">
                    {product.variants.size.map(s => (
                      <button key={s} onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 rounded-md text-sm border transition-colors ${selectedSize === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:border-primary'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <label className="text-sm font-medium text-foreground">Cantidad</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 rounded border border-border hover:bg-muted transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-1 rounded border border-border hover:bg-muted transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
              <span className="text-xs text-muted-foreground">({product.stock} disponibles)</span>
            </div>

            <Button onClick={handleAddToCart} className="w-full" size="lg">
              Agregar al Carrito
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
