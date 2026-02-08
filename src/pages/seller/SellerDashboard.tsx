import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { formatCOP } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Package, DollarSign, ShoppingBag, AlertTriangle, Plus, Pencil, Trash2 } from 'lucide-react';
import { Product, OrderStatus } from '@/types/coffea';

const statusLabels: Record<string, string> = { PENDING: 'Pendiente', PAID: 'Pagada', PACKED: 'Empacada', SHIPPED: 'Enviada', DELIVERED: 'Entregada', CANCELLED: 'Cancelada' };
const nextStatus: Record<string, OrderStatus> = { PAID: 'PACKED', PACKED: 'SHIPPED', SHIPPED: 'DELIVERED' };

export default function SellerDashboard() {
  const { user } = useAuth();
  const { stores, products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus, addStore, getStoreByUserId } = useData();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'dashboard' | 'products' | 'orders' | 'create-product' | 'create-store'>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const store = user ? getStoreByUserId(user.id) : null;
  const storeProducts = store ? products.filter(p => p.storeId === store.id) : [];
  const storeOrders = store ? orders.filter(o => o.storeId === store.id) : [];

  const totalSales = storeOrders.filter(o => o.paymentStatus === 'completed').reduce((s, o) => s + o.subtotal, 0);
  const totalCommission = storeOrders.filter(o => o.paymentStatus === 'completed').reduce((s, o) => s + o.commission, 0);
  const netIncome = totalSales - totalCommission;
  const lowStock = storeProducts.filter(p => p.active && p.stock < 10);

  // Create store form
  const [storeForm, setStoreForm] = useState({ businessName: '', legalName: '', nit: '', bankAccount: '' });
  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    addStore({ id: `s${Date.now()}`, userId: user!.id, ...storeForm, status: 'PENDING' });
    toast.success('Tienda creada. Pendiente de aprobación.');
    setTab('dashboard');
  };

  // Product form
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', stock: '', origin: '', variety: '', tastingNotes: '', preparation: '', imageUrl: '' });
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: `p${Date.now()}`, storeId: store!.id, active: true,
      name: productForm.name, description: productForm.description,
      price: Number(productForm.price), stock: Number(productForm.stock),
      origin: productForm.origin || undefined, variety: productForm.variety || undefined,
      tastingNotes: productForm.tastingNotes || undefined, preparation: productForm.preparation || undefined,
      imageUrl: productForm.imageUrl || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500',
      variants: { grind: ['Grano entero', 'Molido'], size: ['250g', '500g'] },
    };
    addProduct(newProduct);
    toast.success('Producto creado');
    setProductForm({ name: '', description: '', price: '', stock: '', origin: '', variety: '', tastingNotes: '', preparation: '', imageUrl: '' });
    setTab('products');
  };

  if (!user || user.role !== 'SELLER') return <div className="min-h-screen bg-background"><Navbar /><div className="container mx-auto px-4 py-16 text-center"><p className="text-muted-foreground">Acceso no autorizado</p></div></div>;

  if (!store) return (
    <div className="min-h-screen bg-background"><Navbar />
      <main className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-3xl font-display font-bold mb-4">Crea tu Tienda</h1>
        <p className="text-muted-foreground mb-6">Completa la información para empezar a vender</p>
        <form onSubmit={handleCreateStore} className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div><label className="text-sm font-medium block mb-1">Nombre Comercial</label><Input value={storeForm.businessName} onChange={e => setStoreForm({ ...storeForm, businessName: e.target.value })} required /></div>
          <div><label className="text-sm font-medium block mb-1">Razón Social</label><Input value={storeForm.legalName} onChange={e => setStoreForm({ ...storeForm, legalName: e.target.value })} required /></div>
          <div><label className="text-sm font-medium block mb-1">NIT</label><Input value={storeForm.nit} onChange={e => setStoreForm({ ...storeForm, nit: e.target.value })} required /></div>
          <div><label className="text-sm font-medium block mb-1">Cuenta Bancaria</label><Input value={storeForm.bankAccount} onChange={e => setStoreForm({ ...storeForm, bankAccount: e.target.value })} required /></div>
          <Button type="submit" className="w-full">Enviar Solicitud</Button>
        </form>
      </main>
    </div>
  );

  if (store.status === 'PENDING') return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 text-gold mx-auto mb-4" />
        <h1 className="text-2xl font-display font-bold mb-2">Tienda en Revisión</h1>
        <p className="text-muted-foreground">Tu tienda <strong>{store.businessName}</strong> está pendiente de aprobación</p>
      </div>
    </div>
  );

  if (store.status === 'REJECTED') return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-display font-bold mb-2">Tienda Rechazada</h1>
        <p className="text-muted-foreground">Tu solicitud de tienda fue rechazada. Contacta al administrador.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-display font-bold">{store.businessName}</h1>
          <div className="flex gap-2">
            {['dashboard', 'products', 'orders'].map(t => (
              <button key={t} onClick={() => setTab(t as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                {t === 'dashboard' ? 'Dashboard' : t === 'products' ? 'Productos' : 'Órdenes'}
              </button>
            ))}
          </div>
        </div>

        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-card rounded-lg border border-border p-5"><DollarSign className="w-5 h-5 text-primary mb-2" /><p className="text-sm text-muted-foreground">Total Ventas</p><p className="text-2xl font-bold">{formatCOP(totalSales)}</p></div>
              <div className="bg-card rounded-lg border border-border p-5"><ShoppingBag className="w-5 h-5 text-primary mb-2" /><p className="text-sm text-muted-foreground">Órdenes</p><p className="text-2xl font-bold">{storeOrders.length}</p></div>
              <div className="bg-card rounded-lg border border-border p-5"><Package className="w-5 h-5 text-primary mb-2" /><p className="text-sm text-muted-foreground">Ingresos Netos</p><p className="text-2xl font-bold">{formatCOP(netIncome)}</p><p className="text-xs text-muted-foreground">Comisión: {formatCOP(totalCommission)} (1.5%)</p></div>
            </div>
            {lowStock.length > 0 && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm font-medium text-destructive flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Stock bajo</p>
                {lowStock.map(p => <p key={p.id} className="text-sm text-muted-foreground ml-6">{p.name}: {p.stock} unidades</p>)}
              </div>
            )}
          </div>
        )}

        {tab === 'products' && (
          <div>
            <div className="flex justify-end mb-4">
              <Button onClick={() => setTab('create-product')} size="sm"><Plus className="w-4 h-4 mr-1" /> Crear Producto</Button>
            </div>
            <div className="space-y-3">
              {storeProducts.filter(p => p.active).map(p => (
                <div key={p.id} className="bg-card rounded-lg border border-border p-4 flex items-center gap-4">
                  <img src={p.imageUrl || '/placeholder.svg'} alt={p.name} className="w-16 h-16 rounded object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">{formatCOP(p.price)} · Stock: {p.stock}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { const newStock = prompt('Nuevo stock:', String(p.stock)); if (newStock) { updateProduct(p.id, { stock: Number(newStock) }); toast.success('Stock actualizado'); } }} className="p-2 text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => { deleteProduct(p.id); toast.success('Producto eliminado'); }} className="p-2 text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'create-product' && (
          <form onSubmit={handleCreateProduct} className="bg-card rounded-lg border border-border p-6 max-w-2xl space-y-4">
            <h2 className="text-xl font-display font-semibold">Crear Producto</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium block mb-1">Nombre</label><Input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required /></div>
              <div><label className="text-sm font-medium block mb-1">Precio (COP)</label><Input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required /></div>
              <div><label className="text-sm font-medium block mb-1">Stock</label><Input type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} required /></div>
              <div><label className="text-sm font-medium block mb-1">Origen</label><Input value={productForm.origin} onChange={e => setProductForm({ ...productForm, origin: e.target.value })} /></div>
              <div><label className="text-sm font-medium block mb-1">Variedad</label><Input value={productForm.variety} onChange={e => setProductForm({ ...productForm, variety: e.target.value })} /></div>
              <div><label className="text-sm font-medium block mb-1">Notas de cata</label><Input value={productForm.tastingNotes} onChange={e => setProductForm({ ...productForm, tastingNotes: e.target.value })} /></div>
            </div>
            <div><label className="text-sm font-medium block mb-1">Descripción</label><Textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} required /></div>
            <div className="flex gap-3">
              <Button type="submit">Crear Producto</Button>
              <Button type="button" variant="outline" onClick={() => setTab('products')}>Cancelar</Button>
            </div>
          </form>
        )}

        {tab === 'orders' && (
          <div className="space-y-3">
            {storeOrders.length === 0 ? <p className="text-center py-8 text-muted-foreground">Sin órdenes aún</p> :
              storeOrders.map(o => (
                <div key={o.id} className="bg-card rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div><span className="font-mono text-sm font-medium">{o.orderNumber}</span><span className="text-xs text-muted-foreground ml-2">{new Date(o.createdAt).toLocaleDateString('es-CO')}</span></div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{statusLabels[o.status]}</span>
                      {nextStatus[o.status] && (
                        <Button size="sm" variant="outline" onClick={() => { updateOrderStatus(o.id, nextStatus[o.status]); toast.success(`Estado actualizado a ${statusLabels[nextStatus[o.status]]}`); console.log(`[EMAIL MOCK] To: ${o.buyer.email} | Subject: Tu orden ${o.orderNumber} está ${statusLabels[nextStatus[o.status]]}`); }}>
                          → {statusLabels[nextStatus[o.status]]}
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{o.buyer.name} · {o.shippingCity}</p>
                  <p className="text-sm font-semibold text-primary mt-1">{formatCOP(o.total)}</p>
                </div>
              ))
            }
          </div>
        )}
      </main>
    </div>
  );
}
