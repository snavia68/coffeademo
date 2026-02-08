import { useMemo, useState } from 'react';
import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/layout/Navbar';
import ProductCard from '@/components/marketplace/ProductCard';
import ProductFilters from '@/components/marketplace/ProductFilters';
import heroImage from '@/assets/hero-coffee.jpg';

const Index = () => {
  const { products } = useData();
  const [filters, setFilters] = useState({ search: '', origin: '', variety: '' });

  const activeProducts = useMemo(() => {
    let filtered = products.filter(p => p.active);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    if (filters.origin) filtered = filtered.filter(p => p.origin === filters.origin);
    if (filters.variety) filtered = filtered.filter(p => p.variety === filters.variety);
    return filtered;
  }, [products, filters]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — editorial / WAC style */}
      <section className="relative h-[520px] md:h-[600px] overflow-hidden">
        <img src={heroImage} alt="Café colombiano" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--hero-bg))] via-[hsl(var(--hero-bg)/0.6)] to-transparent" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-cream/70 mb-4 animate-fade-in">
            Marketplace de Café Colombiano
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display leading-[0.9] text-cream mb-6 animate-fade-in max-w-3xl">
            EL MEJOR CAFÉ DE COLOMBIA
          </h1>
          <p className="text-base md:text-lg text-cream/60 max-w-lg animate-fade-in font-light" style={{ animationDelay: '0.1s' }}>
            Directo de productores y tostadores locales a tu taza.
            Origen único, trazabilidad completa.
          </p>
        </div>
      </section>

      {/* Catalog */}
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-2">CATÁLOGO</h2>
          <div className="w-16 h-[2px] bg-accent" />
        </div>

        <ProductFilters filters={filters} onChange={setFilters} />

        {activeProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg tracking-wide">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {activeProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-2xl tracking-widest text-muted-foreground">COFFEA</span>
          <p className="text-xs tracking-widest uppercase text-muted-foreground">
            Café colombiano · Desde el origen
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
