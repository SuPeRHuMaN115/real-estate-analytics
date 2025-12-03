import React from 'react';
import { Valuation, Property } from '@/types';

interface ValuationReportProps {
  valuation: Valuation;
  property: Property;
}

export default function ValuationReport({
  valuation,
  property,
}: ValuationReportProps) {
  const formatCurrency = (value?: number) =>
    value ? `$${value.toLocaleString()}` : '-';

  const confidenceColor =
    (valuation.confidence || 0) >= 0.8
      ? 'text-green-600'
      : (valuation.confidence || 0) >= 0.6
      ? 'text-yellow-600'
      : 'text-red-600';

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="card-body">
          <h3 className="text-lg font-medium opacity-90">Estimated Value</h3>
          <p className="text-4xl font-bold mt-2">
            {formatCurrency(valuation.estimatedValue)}
          </p>
          {valuation.valueLow && valuation.valueHigh && (
            <p className="text-sm opacity-80 mt-1">
              Range: {formatCurrency(valuation.valueLow)} -{' '}
              {formatCurrency(valuation.valueHigh)}
            </p>
          )}
          <div className="mt-4 flex items-center space-x-4">
            {valuation.valuePerUnit && (
              <div>
                <p className="text-sm opacity-80">Per Unit</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(valuation.valuePerUnit)}
                </p>
              </div>
            )}
            {valuation.valuePerSqFt && (
              <div>
                <p className="text-sm opacity-80">Per SF</p>
                <p className="text-xl font-semibold">
                  ${valuation.valuePerSqFt.toFixed(0)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Valuation Approaches */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Valuation Approaches</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">
                Sales Comparison Approach
              </h4>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(valuation.salesCompValue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Based on adjusted comparable sales
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Income Approach</h4>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(valuation.incomeValue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">NOI capitalized at market rate</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Confidence Level</h4>
              <p className={`text-2xl font-bold mt-1 ${confidenceColor}`}>
                {valuation.confidence
                  ? `${(valuation.confidence * 100).toFixed(0)}%`
                  : '-'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Based on data quality</p>
            </div>
          </div>
        </div>
      </div>

      {/* Property Summary */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Property Summary</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Property Type</p>
              <p className="font-medium">{property.propertyType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Units</p>
              <p className="font-medium">{property.units || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year Built</p>
              <p className="font-medium">{property.yearBuilt || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Quality</p>
              <p className="font-medium">
                {property.quality?.replace('_', ' ') || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">NOI</p>
              <p className="font-medium">{formatCurrency(property.noi)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cap Rate</p>
              <p className="font-medium">
                {property.capRate ? `${(property.capRate * 100).toFixed(2)}%` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Occupancy</p>
              <p className="font-medium">
                {property.occupancy ? `${(property.occupancy * 100).toFixed(1)}%` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Condition</p>
              <p className="font-medium">{property.condition || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      {(valuation.aiSummary || valuation.aiRecommendations) && (
        <div className="card">
          <div className="card-header bg-purple-50">
            <h3 className="text-lg font-semibold text-purple-900">AI Analysis</h3>
          </div>
          <div className="card-body space-y-4">
            {valuation.aiSummary && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{valuation.aiSummary}</p>
              </div>
            )}
            {valuation.aiRecommendations && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {valuation.aiRecommendations}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timestamp */}
      <p className="text-sm text-gray-500 text-center">
        Valuation generated on{' '}
        {new Date(valuation.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
    </div>
  );
}
