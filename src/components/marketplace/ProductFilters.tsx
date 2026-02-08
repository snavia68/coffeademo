import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Filters {
  search: string;
  origin: string;
  variety: string;
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const origins = ['Huila', 'Nariño', 'Tolima', 'Varias regiones'];
const varieties = ['Geisha', 'Caturra', 'Typica', 'Bourbon', 'Blend'];

export default function ProductFilters({ filters, onChange }: Props) {
  const hasFilters = filters.search || filters.origin || filters.variety;

  const selectClass =
    'text-xs tracking-wider uppercase border-0 border-b border-border bg-transparent text-foreground px-1 py-2 focus:outline-none focus:border-foreground transition-colors appearance-none cursor-pointer';

  return (
    <div className="mb-10 space-y-5">
      <div className="relative max-w-sm">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar café..."
          className="pl-7 border-0 border-b border-border rounded-none bg-transparent text-sm tracking-wide placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
          value={filters.search}
          onChange={e => onChange({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <select
          className={selectClass}
          value={filters.origin}
          onChange={e => onChange({ ...filters, origin: e.target.value })}
        >
          <option value="">Todos los orígenes</option>
          {origins.map(o => <option key={o} value={o}>{o}</option>)}
        </select>

        <select
          className={selectClass}
          value={filters.variety}
          onChange={e => onChange({ ...filters, variety: e.target.value })}
        >
          <option value="">Todas las variedades</option>
          {varieties.map(v => <option key={v} value={v}>{v}</option>)}
        </select>

        {hasFilters && (
          <button
            onClick={() => onChange({ search: '', origin: '', variety: '' })}
            className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
          >
            <X className="w-3 h-3" /> Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
