import { Product } from '@/types/coffea';
import { stores } from '@/data/mock-data';
import { formatCOP } from '@/data/mock-data';
import { Link } from 'react-router-dom';
import { MapPin, Coffee } from 'lucide-react';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const store = stores.find(s => s.id === product.storeId);

  return (
    <Link to={`/products/${product.id}`} className="group block animate-fade-in">
      <div className="bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={product.imageUrl || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">{store?.businessName}</p>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            {product.origin && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {product.origin}
              </span>
            )}
            {product.variety && (
              <span className="flex items-center gap-1">
                <Coffee className="w-3 h-3" /> {product.variety}
              </span>
            )}
          </div>
          {product.tastingNotes && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-1">🫘 {product.tastingNotes}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">{formatCOP(product.price)}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 10 ? 'bg-secondary text-secondary-foreground' : 'bg-destructive/10 text-destructive'}`}>
              {product.stock > 10 ? 'En stock' : `${product.stock} restantes`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
