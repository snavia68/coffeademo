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
      <div className="overflow-hidden transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={product.imageUrl || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Info */}
        <div className="pt-4 pb-2">
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">
            {store?.businessName}
          </p>
          <h3 className="font-display text-2xl leading-tight text-foreground mb-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-3 text-[11px] tracking-wide text-muted-foreground mb-3">
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
            <p className="text-xs text-muted-foreground mb-3 line-clamp-1 italic">{product.tastingNotes}</p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="font-display text-xl text-foreground">{formatCOP(product.price)}</span>
            <span className={`text-[10px] tracking-wider uppercase ${product.stock > 10 ? 'text-sage' : 'text-destructive'}`}>
              {product.stock > 10 ? 'En stock' : `${product.stock} restantes`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
