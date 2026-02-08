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

  return (
    <div className="mb-8 space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar café..."
          className="pl-10"
          value={filters.search}
          onChange={e => onChange({ ...filters, search: e.target.value })}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <select
          className="text-sm border border-border rounded-md px-3 py-1.5 bg-card text-foreground"
          value={filters.origin}
          onChange={e => onChange({ ...filters, origin: e.target.value })}
        >
          <option value="">Todos los orígenes</option>
          {origins.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select
          className="text-sm border border-border rounded-md px-3 py-1.5 bg-card text-foreground"
          value={filters.variety}
          onChange={e => onChange({ ...filters, variety: e.target.value })}
        >
          <option value="">Todas las variedades</option>
          {varieties.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        {hasFilters && (
          <button
            onClick={() => onChange({ search: '', origin: '', variety: '' })}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
