import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PropertyCard } from '@/components';
import { Property, PropertyType } from '@/types';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    isSubject: '',
    propertyType: '',
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProperties();
  }, [filter]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.isSubject) params.set('isSubject', filter.isSubject);
      if (filter.propertyType) params.set('propertyType', filter.propertyType);
      params.set('limit', '50');

      const response = await fetch(`/api/properties?${params}`);
      const result = await response.json();

      if (result.success) {
        setProperties(result.data.properties);
        setTotal(result.data.total);
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
        setTotal((prev) => prev - 1);
      }
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-1">{total} properties in database</p>
        </div>
        <Link href="/properties/new" className="btn btn-primary">
          Add Property
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Property Category</label>
              <select
                value={filter.isSubject}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, isSubject: e.target.value }))
                }
                className="input"
              >
                <option value="">All Properties</option>
                <option value="true">Subject Properties Only</option>
                <option value="false">Comps Only</option>
              </select>
            </div>

            <div>
              <label className="label">Property Type</label>
              <select
                value={filter.propertyType}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    propertyType: e.target.value,
                  }))
                }
                className="input"
              >
                <option value="">All Types</option>
                {Object.values(PropertyType).map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilter({ isSubject: '', propertyType: '' })}
                className="btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onDelete={handleDelete}
              showActions={true}
            />
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="card-body text-center py-12">
            <p className="text-gray-500">No properties found.</p>
            <Link
              href="/properties/new"
              className="btn btn-primary mt-4 inline-block"
            >
              Add Your First Property
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
