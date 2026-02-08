import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, User, LogOut, Store, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-display font-bold text-primary">
            ☕ Coffea
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
              Productos
            </Link>

            {user ? (
              <>
                {user.role === 'BUYER' && (
                  <Link to="/mis-ordenes" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    Mis Órdenes
                  </Link>
                )}
                {user.role === 'SELLER' && (
                  <Link to="/seller" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                    <Store className="w-4 h-4" /> Mi Tienda
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                    <Shield className="w-4 h-4" /> Admin
                  </Link>
                )}
                {user.role === 'BUYER' && (
                  <Link to="/cart" className="relative text-muted-foreground hover:text-primary transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                )}
                <div className="flex items-center gap-3 ml-2 pl-4 border-l border-border">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="w-4 h-4" /> {user.name}
                  </span>
                  <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Ingresar
                </Link>
                <Link to="/register" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-3 pb-3 space-y-2 border-t border-border pt-3">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-foreground">Productos</Link>
            {user ? (
              <>
                {user.role === 'BUYER' && <Link to="/cart" onClick={() => setMobileOpen(false)} className="block py-2 text-sm">🛒 Carrito ({itemCount})</Link>}
                {user.role === 'BUYER' && <Link to="/mis-ordenes" onClick={() => setMobileOpen(false)} className="block py-2 text-sm">Mis Órdenes</Link>}
                {user.role === 'SELLER' && <Link to="/seller" onClick={() => setMobileOpen(false)} className="block py-2 text-sm">Mi Tienda</Link>}
                {user.role === 'ADMIN' && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-sm">Admin</Link>}
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block py-2 text-sm text-destructive">Salir</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-sm">Ingresar</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-semibold text-primary">Registrarse</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
