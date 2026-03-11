'use client';

interface TravelFiltersProps {
  destination: string;
  onDestinationChange: (value: string) => void;
  minPrice: number | null;
  onMinPriceChange: (value: number | null) => void;
  maxPrice: number | null;
  onMaxPriceChange: (value: number | null) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function TravelFilters({
  destination,
  onDestinationChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  sortBy,
  onSortChange,
}: TravelFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-4">
      <h3 className="font-bold text-lg text-slate-900">Filtres</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Destination */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Destination
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDestinationChange((e.target as HTMLInputElement).value)}
            placeholder="Chercher..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Prix minimum */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Prix minimum (€)
          </label>
          <input
            type="number"
            value={minPrice ? minPrice / 100 : ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onMinPriceChange((e.target as HTMLInputElement).value ? parseInt((e.target as HTMLInputElement).value) * 100 : null)}
            placeholder="0"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Prix maximum */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Prix maximum (€)
          </label>
          <input
            type="number"
            value={maxPrice ? maxPrice / 100 : ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onMaxPriceChange((e.target as HTMLInputElement).value ? parseInt((e.target as HTMLInputElement).value) * 100 : null)}
            placeholder="10000"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tri */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Trier par
        </label>
        <select
          value={sortBy}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSortChange((e.target as HTMLInputElement).value)}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="popular">Plus populaires</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="rating">Meilleure notation</option>
        </select>
      </div>
    </div>
  );
}
