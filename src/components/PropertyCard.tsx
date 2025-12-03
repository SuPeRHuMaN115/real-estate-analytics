import React from 'react';
import Link from 'next/link';
import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export default function PropertyCard({
  property,
  onDelete,
  showActions = true,
}: PropertyCardProps) {
  const price = property.salePrice || property.listPrice;
  const formattedPrice = price
    ? `$${price.toLocaleString()}`
    : 'Price not available';

  const formatPercent = (value?: number) =>
    value ? `${(value * 100).toFixed(2)}%` : '-';

  const formatCurrency = (value?: number) =>
    value ? `$${value.toLocaleString()}` : '-';

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="card-header">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {property.name || property.address}
            </h3>
            <p className="text-sm text-gray-600">
              {property.city}, {property.state} {property.zipCode}
            </p>
          </div>
          {property.isSubjectProperty && (
            <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
              Subject
            </span>
          )}
        </div>
      </div>

      <div className="card-body">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">{formattedPrice}</p>
            <p className="text-sm text-gray-500">
              {property.pricePerUnit
                ? `$${property.pricePerUnit.toLocaleString()}/unit`
                : property.pricePerSqFt
                ? `$${property.pricePerSqFt.toFixed(0)}/SF`
                : ''}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-green-600">
              {formatPercent(property.capRate)} Cap
            </p>
            <p className="text-sm text-gray-500">
              NOI: {formatCurrency(property.noi)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-gray-500">Type</p>
            <p className="font-medium">{property.propertyType}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-gray-500">Units</p>
            <p className="font-medium">{property.units || '-'}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-gray-500">Year Built</p>
            <p className="font-medium">{property.yearBuilt || '-'}</p>
          </div>
        </div>

        {property.quality && (
          <div className="mt-3">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                property.quality === 'CLASS_A'
                  ? 'bg-green-100 text-green-700'
                  : property.quality === 'CLASS_B'
                  ? 'bg-blue-100 text-blue-700'
                  : property.quality === 'CLASS_C'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {property.quality.replace('_', ' ')}
            </span>
          </div>
        )}

        {showActions && (
          <div className="mt-4 flex space-x-2">
            <Link
              href={`/properties/${property.id}`}
              className="btn btn-primary text-sm flex-1 text-center"
            >
              View Details
            </Link>
            <Link
              href={`/analysis?subject=${property.id}`}
              className="btn btn-secondary text-sm"
            >
              Analyze
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(property.id)}
                className="btn btn-danger text-sm"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
