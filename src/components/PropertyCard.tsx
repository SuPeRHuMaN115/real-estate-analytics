import { Property } from '@/types';
import { getPricePerSquareFoot } from '@/utils/analysis';

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
  isSelected?: boolean;
  showCompare?: boolean;
}

export default function PropertyCard({ property, onSelect, isSelected, showCompare = false }: PropertyCardProps) {
  const pricePerSqft = getPricePerSquareFoot(property);
  const statusColors = {
    'Active': 'bg-green-500',
    'Pending': 'bg-yellow-500',
    'Sold': 'bg-blue-500',
    'Off Market': 'bg-gray-500',
  };

  return (
    <div
      className={`border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="relative">
        <img
          src={property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={property.address}
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-white text-sm font-semibold ${statusColors[property.status]}`}>
          {property.status}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-bold text-xl text-gray-900">${property.price.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">${pricePerSqft}/sqft</p>
        </div>

        <p className="text-gray-700 font-medium mb-2">{property.address}</p>
        <p className="text-gray-600 text-sm mb-3">
          {property.city}, {property.state} {property.zipCode}
        </p>

        <div className="flex gap-4 mb-3 text-sm text-gray-700">
          <div>
            <span className="font-semibold">{property.bedrooms}</span> bed
          </div>
          <div>
            <span className="font-semibold">{property.bathrooms}</span> bath
          </div>
          <div>
            <span className="font-semibold">{property.squareFeet.toLocaleString()}</span> sqft
          </div>
        </div>

        <div className="flex gap-2 mb-3 text-xs text-gray-600">
          <span className="bg-gray-100 px-2 py-1 rounded">{property.propertyType}</span>
          <span className="bg-gray-100 px-2 py-1 rounded">Built {property.yearBuilt}</span>
          {property.daysOnMarket && (
            <span className="bg-gray-100 px-2 py-1 rounded">{property.daysOnMarket} DOM</span>
          )}
        </div>

        {property.features && property.features.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {property.features.slice(0, 3).map((feature, idx) => (
                <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  {feature}
                </span>
              ))}
              {property.features.length > 3 && (
                <span className="text-xs text-gray-500">+{property.features.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {showCompare && (
          <button
            onClick={() => onSelect?.(property)}
            className={`w-full py-2 px-4 rounded font-medium transition-colors ${
              isSelected
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isSelected ? 'Selected' : 'Select for Comparison'}
          </button>
        )}
      </div>
    </div>
  );
}
