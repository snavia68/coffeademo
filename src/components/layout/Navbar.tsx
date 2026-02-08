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

  const navLinkClass = (path: string) =>
    `text-xs tracking-[0.2em] uppercase font-medium transition-colors hover:text-accent ${location.pathname === path ? 'text-foreground' : 'text-muted-foreground'}`;

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-display text-3xl tracking-widest text-foreground hover:text-accent transition-colors">
            COFFEA
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={navLinkClass('/')}>
              Productos
            </Link>

            {user ? (
              <>
                {user.role === 'BUYER' && (
                  <Link to="/mis-ordenes" className={navLinkClass('/mis-ordenes')}>
                    Órdenes
                  </Link>
                )}
                {user.role === 'SELLER' && (
                  <Link to="/seller" className={navLinkClass('/seller')}>
                    <span className="flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5" /> Mi Tienda
                    </span>
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className={navLinkClass('/admin')}>
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Admin
                    </span>
                  </Link>
                )}
              </>
            ) : null}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-5">
            {user ? (
              <>
                {user.role === 'BUYER' && (
                  <Link to="/cart" className="relative text-muted-foreground hover:text-foreground transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2.5 bg-accent text-accent-foreground text-[10px] rounded-full h-4.5 w-4.5 flex items-center justify-center font-bold">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-4 border-l border-border/50">
                  <span className="text-xs tracking-wide text-muted-foreground flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> {user.name}
                  </span>
                  <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className={navLinkClass('/login')}>
                  Ingresar
                </Link>
                <Link to="/register" className="text-xs tracking-[0.15em] uppercase font-medium bg-foreground text-background px-5 py-2.5 hover:bg-accent hover:text-accent-foreground transition-colors">
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-6 space-y-1 border-t border-border/50 pt-4">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2.5 text-xs tracking-[0.2em] uppercase font-medium text-foreground">
              Productos
            </Link>
            {user ? (
              <>
                {user.role === 'BUYER' && (
                  <Link to="/cart" onClick={() => setMobileOpen(false)} className="block py-2.5 text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    Carrito ({itemCount})
                  </Link>
                )}
                {user.role === 'BUYER' && (
                  <Link to="/mis-ordenes" onClick={() => setMobileOpen(false)} className="block py-2.5 text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    Mis Órdenes
                  </Link>
                )}
                {user.role === 'SELLER' && (
                  <Link to="/seller" onClick={() => setMobileOpen(false)} className="block py-2.5 text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    Mi Tienda
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-2.5 text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="block py-2.5 text-xs tracking-[0.2em] uppercase text-destructive"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2.5 text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  Ingresar
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block py-2.5 text-xs tracking-[0.2em] uppercase font-semibold text-foreground">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
