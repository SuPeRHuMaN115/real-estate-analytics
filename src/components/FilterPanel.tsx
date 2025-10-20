import { PropertyFilters } from '@/types';
import { useState } from 'react';

interface FilterPanelProps {
  filters: PropertyFilters;
  onFilterChange: (filters: PropertyFilters) => void;
}

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Filters</h3>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-sm text-gray-600 font-medium"
          >
            {isOpen ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className={`space-y-4 ${isOpen ? 'block' : 'hidden md:block'}`}>
        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Price Range</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Bedrooms</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minBedrooms || ''}
              onChange={(e) => updateFilter('minBedrooms', e.target.value ? Number(e.target.value) : undefined)}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxBedrooms || ''}
              onChange={(e) => updateFilter('maxBedrooms', e.target.value ? Number(e.target.value) : undefined)}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Bathrooms</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              step="0.5"
              placeholder="Min"
              value={filters.minBathrooms || ''}
              onChange={(e) => updateFilter('minBathrooms', e.target.value ? Number(e.target.value) : undefined)}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="number"
              step="0.5"
              placeholder="Max"
              value={filters.maxBathrooms || ''}
              onChange={(e) => updateFilter('maxBathrooms', e.target.value ? Number(e.target.value) : undefined)}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Square Feet */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Square Feet</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minSquareFeet || ''}
              onChange={(e) => updateFilter('minSquareFeet', e.target.value ? Number(e.target.value) : undefined)}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxSquareFeet || ''}
              onChange={(e) => updateFilter('maxSquareFeet', e.target.value ? Number(e.target.value) : undefined)}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Property Type</label>
          <div className="space-y-2">
            {['Single Family', 'Condo', 'Townhouse', 'Multi-Family'].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.propertyTypes?.includes(type as any) || false}
                  onChange={(e) => {
                    const types = filters.propertyTypes || [];
                    if (e.target.checked) {
                      updateFilter('propertyTypes', [...types, type]);
                    } else {
                      updateFilter('propertyTypes', types.filter(t => t !== type));
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Status</label>
          <div className="space-y-2">
            {['Active', 'Pending', 'Sold', 'Off Market'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.statuses?.includes(status as any) || false}
                  onChange={(e) => {
                    const statuses = filters.statuses || [];
                    if (e.target.checked) {
                      updateFilter('statuses', [...statuses, status]);
                    } else {
                      updateFilter('statuses', statuses.filter(s => s !== status));
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">City</label>
          <input
            type="text"
            placeholder="Enter city"
            value={filters.city || ''}
            onChange={(e) => updateFilter('city', e.target.value || undefined)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
