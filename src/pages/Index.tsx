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

      {/* Hero */}
      <section className="relative h-[420px] overflow-hidden">
        <img src={heroImage} alt="Café colombiano" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/30" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4 max-w-lg animate-fade-in">
            El Mejor Café Colombiano
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-md animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Directo de productores y tostadores locales a tu taza
          </p>
        </div>
      </section>

      {/* Catalog */}
      <main className="container mx-auto px-4 py-10">
        <ProductFilters filters={filters} onChange={setFilters} />

        {activeProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
