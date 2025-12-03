import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { PropertyForm, ValuationReport } from '@/components';
import { Property, PropertyInput, Valuation, CompAnalysis } from '@/types';

interface PropertyWithRelations extends Property {
  subjectComps?: (CompAnalysis & { comp: Property })[];
  valuations?: Valuation[];
}

export default function PropertyDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState<PropertyWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${id}`);
      const result = await response.json();

      if (result.success) {
        setProperty(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch property');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: PropertyInput) => {
    const response = await fetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to update property');
    }

    setProperty(result.data);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        router.push('/properties');
      }
    } catch (err) {
      console.error('Failed to delete property:', err);
    }
  };

  const formatCurrency = (value?: number) =>
    value ? `$${value.toLocaleString()}` : '-';

  const formatPercent = (value?: number) =>
    value !== undefined ? `${(value * 100).toFixed(2)}%` : '-';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="card">
        <div className="card-body text-center py-12">
          <p className="text-red-600">{error || 'Property not found'}</p>
          <Link href="/properties" className="btn btn-primary mt-4 inline-block">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
          <button onClick={() => setEditing(false)} className="btn btn-secondary">
            Cancel
          </button>
        </div>
        <PropertyForm
          initialData={property}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
        />
      </div>
    );
  }

  const latestValuation = property.valuations?.[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {property.name || property.address}
            </h1>
            {property.isSubjectProperty && (
              <span className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-700 rounded-full">
                Subject Property
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-1">
            {property.address}, {property.city}, {property.state} {property.zipCode}
          </p>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/analysis?subject=${property.id}`}
            className="btn btn-primary"
          >
            Run Analysis
          </Link>
          <button onClick={() => setEditing(true)} className="btn btn-secondary">
            Edit
          </button>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(property.salePrice || property.listPrice)}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-500">Cap Rate</p>
            <p className="text-2xl font-bold text-green-600">
              {formatPercent(property.capRate)}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-500">NOI</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(property.noi)}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-500">Price/Unit</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(property.pricePerUnit)}
            </p>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold">Property Details</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500">Property Type</p>
              <p className="font-medium">{property.propertyType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sub-Type</p>
              <p className="font-medium">{property.propertySubType || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Units</p>
              <p className="font-medium">{property.units || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Square Feet</p>
              <p className="font-medium">
                {property.squareFeet?.toLocaleString() || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year Built</p>
              <p className="font-medium">{property.yearBuilt || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year Renovated</p>
              <p className="font-medium">{property.yearRenovated || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Condition</p>
              <p className="font-medium">{property.condition || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Quality</p>
              <p className="font-medium">
                {property.quality?.replace('_', ' ') || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Occupancy</p>
              <p className="font-medium">{formatPercent(property.occupancy)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Lot Size</p>
              <p className="font-medium">
                {property.lotSizeAcres
                  ? `${property.lotSizeAcres.toFixed(2)} acres`
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Unit Size</p>
              <p className="font-medium">
                {property.avgUnitSize ? `${property.avgUnitSize} SF` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">GRM</p>
              <p className="font-medium">
                {property.grm ? property.grm.toFixed(2) : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Details */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold">Financial Details</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500">Gross Potential Rent</p>
              <p className="font-medium">
                {formatCurrency(property.grossPotentialRent)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Effective Gross Income</p>
              <p className="font-medium">
                {formatCurrency(property.effectiveGrossIncome)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Operating Expenses</p>
              <p className="font-medium">
                {formatCurrency(property.operatingExpenses)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expense Ratio</p>
              <p className="font-medium">{formatPercent(property.expenseRatio)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vacancy Rate</p>
              <p className="font-medium">{formatPercent(property.vacancyRate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price/SF</p>
              <p className="font-medium">
                {property.pricePerSqFt
                  ? `$${property.pricePerSqFt.toFixed(0)}`
                  : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {(property.notes || property.amenities || property.source) && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Additional Information</h2>
          </div>
          <div className="card-body space-y-4">
            {property.amenities && (
              <div>
                <p className="text-sm text-gray-500">Amenities</p>
                <p className="font-medium">{property.amenities}</p>
              </div>
            )}
            {property.source && (
              <div>
                <p className="text-sm text-gray-500">Data Source</p>
                <p className="font-medium">{property.source}</p>
              </div>
            )}
            {property.notes && (
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p className="font-medium whitespace-pre-wrap">{property.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Latest Valuation */}
      {latestValuation && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Latest Valuation
          </h2>
          <ValuationReport valuation={latestValuation} property={property} />
        </div>
      )}

      {/* Comp Analyses */}
      {property.subjectComps && property.subjectComps.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">
              Comparable Properties ({property.subjectComps.length})
            </h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {property.subjectComps.map((ca) => (
                <div
                  key={ca.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{ca.comp.address}</p>
                    <p className="text-sm text-gray-500">
                      {ca.comp.city}, {ca.comp.state}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(ca.comp.salePrice || ca.comp.listPrice)}
                    </p>
                    <p className="text-sm text-primary-600">
                      {ca.similarityScore?.toFixed(0)}% similar
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
