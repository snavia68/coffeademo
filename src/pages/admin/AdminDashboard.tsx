import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { formatCOP } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Store, BarChart3, ShoppingBag, DollarSign, Users, CheckCircle, XCircle } from 'lucide-react';
import { OrderStatus } from '@/types/coffea';

const statusLabels: Record<string, string> = { PENDING: 'Pendiente', PAID: 'Pagada', PACKED: 'Empacada', SHIPPED: 'Enviada', DELIVERED: 'Entregada', CANCELLED: 'Cancelada' };

export default function AdminDashboard() {
  const { user } = useAuth();
  const { stores, products, orders, updateStoreStatus, updateOrderStatus } = useData();
  const [tab, setTab] = useState<'dashboard' | 'stores' | 'orders' | 'reports'>('dashboard');

  if (!user || user.role !== 'ADMIN') return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="container mx-auto px-4 py-16 text-center"><p className="text-muted-foreground">Acceso no autorizado</p></div>
    </div>
  );

  const totalSales = orders.filter(o => o.paymentStatus === 'completed').reduce((s, o) => s + o.total, 0);
  const totalCommissions = orders.filter(o => o.paymentStatus === 'completed').reduce((s, o) => s + o.commission, 0);
  const approvedStores = stores.filter(s => s.status === 'APPROVED').length;
  const pendingStores = stores.filter(s => s.status === 'PENDING');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-display font-bold">Panel Administrador</h1>
          <div className="flex gap-2">
            {['dashboard', 'stores', 'orders', 'reports'].map(t => (
              <button key={t} onClick={() => setTab(t as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                {t === 'dashboard' ? 'Dashboard' : t === 'stores' ? 'Tiendas' : t === 'orders' ? 'Órdenes' : 'Reportes'}
              </button>
            ))}
          </div>
        </div>

        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card rounded-lg border border-border p-5"><DollarSign className="w-5 h-5 text-primary mb-2" /><p className="text-sm text-muted-foreground">Ventas Totales</p><p className="text-2xl font-bold">{formatCOP(totalSales)}</p></div>
              <div className="bg-card rounded-lg border border-border p-5"><BarChart3 className="w-5 h-5 text-primary mb-2" /><p className="text-sm text-muted-foreground">Comisiones</p><p className="text-2xl font-bold">{formatCOP(totalCommissions)}</p></div>
              <div className="bg-card rounded-lg border border-border p-5"><ShoppingBag className="w-5 h-5 text-primary mb-2" /><p className="text-sm text-muted-foreground">Órdenes</p><p className="text-2xl font-bold">{orders.length}</p></div>
              <div className="bg-card rounded-lg border border-border p-5"><Store className="w-5 h-5 text-primary mb-2" /><p className="text-sm text-muted-foreground">Tiendas Activas</p><p className="text-2xl font-bold">{approvedStores}</p><p className="text-xs text-gold">{pendingStores.length} pendientes</p></div>
            </div>
          </div>
        )}

        {tab === 'stores' && (
          <div className="space-y-4">
            {stores.map(s => (
              <div key={s.id} className={`bg-card rounded-lg border p-5 ${s.status === 'PENDING' ? 'border-gold/50' : 'border-border'}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{s.businessName}</h3>
                    <p className="text-sm text-muted-foreground">{s.legalName} · NIT: {s.nit}</p>
                    <p className="text-xs text-muted-foreground">Cuenta: {s.bankAccount}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.status === 'APPROVED' ? 'bg-sage/20 text-sage' : s.status === 'PENDING' ? 'bg-gold/20 text-gold' : 'bg-destructive/10 text-destructive'}`}>
                      {s.status === 'APPROVED' ? 'Aprobada' : s.status === 'PENDING' ? 'Pendiente' : 'Rechazada'}
                    </span>
                    {s.status === 'PENDING' && (
                      <>
                        <Button size="sm" onClick={() => { updateStoreStatus(s.id, 'APPROVED'); toast.success('Tienda aprobada'); console.log(`[EMAIL MOCK] Tienda ${s.businessName} aprobada`); }}>
                          <CheckCircle className="w-4 h-4 mr-1" /> Aprobar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { updateStoreStatus(s.id, 'REJECTED'); toast.info('Tienda rechazada'); console.log(`[EMAIL MOCK] Tienda ${s.businessName} rechazada`); }}>
                          <XCircle className="w-4 h-4 mr-1" /> Rechazar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'orders' && (
          <div className="space-y-3">
            {orders.length === 0 ? <p className="text-center py-8 text-muted-foreground">Sin órdenes</p> :
              orders.map(o => (
                <div key={o.id} className="bg-card rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-sm font-medium">{o.orderNumber}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{statusLabels[o.status]}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{o.buyer.name} → {o.store.businessName}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm">{formatCOP(o.total)}</span>
                    <span className="text-xs text-muted-foreground">Comisión: {formatCOP(o.commission)}</span>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {tab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-display font-semibold mb-4">Reporte de Comisiones</h2>
              <div className="space-y-3">
                {stores.filter(s => s.status === 'APPROVED').map(s => {
                  const storeOrders = orders.filter(o => o.storeId === s.id && o.paymentStatus === 'completed');
                  const storeSales = storeOrders.reduce((sum, o) => sum + o.subtotal, 0);
                  const storeComm = storeOrders.reduce((sum, o) => sum + o.commission, 0);
                  return (
                    <div key={s.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <div>
                        <p className="font-medium">{s.businessName}</p>
                        <p className="text-xs text-muted-foreground">{storeOrders.length} órdenes · Ventas: {formatCOP(storeSales)}</p>
                      </div>
                      <p className="font-bold text-primary">{formatCOP(storeComm)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold">
                <span>Total Comisiones</span>
                <span className="text-primary">{formatCOP(totalCommissions)}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
