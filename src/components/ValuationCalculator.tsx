import { Property } from '@/types';
import { performCMA, calculatePricePerSquareFoot } from '@/utils/analysis';
import { useState } from 'react';

interface ValuationCalculatorProps {
  property: Property;
  allProperties: Property[];
}

export default function ValuationCalculator({ property, allProperties }: ValuationCalculatorProps) {
  const [selectedMethod, setSelectedMethod] = useState<'cma' | 'sqft'>('cma');

  const cmaResult = performCMA(property, allProperties);
  const sqftResult = calculatePricePerSquareFoot(property, allProperties);

  const result = selectedMethod === 'cma' ? cmaResult : sqftResult;

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Property Valuation</h2>

      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Property Details</h3>
        <p className="font-medium">{property.address}</p>
        <p className="text-sm text-gray-600">
          {property.city}, {property.state} {property.zipCode}
        </p>
        <div className="mt-2 flex flex-wrap gap-3 text-sm">
          <span className="bg-white px-3 py-1 rounded">{property.bedrooms} bed</span>
          <span className="bg-white px-3 py-1 rounded">{property.bathrooms} bath</span>
          <span className="bg-white px-3 py-1 rounded">{property.squareFeet.toLocaleString()} sqft</span>
          <span className="bg-white px-3 py-1 rounded">{property.propertyType}</span>
          <span className="bg-white px-3 py-1 rounded">Built {property.yearBuilt}</span>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          List Price: <span className="font-bold text-gray-900 text-lg">${property.price.toLocaleString()}</span>
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3 text-gray-700">Valuation Method:</label>
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedMethod('cma')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              selectedMethod === 'cma'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Comparative Market Analysis
          </button>
          <button
            onClick={() => setSelectedMethod('sqft')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              selectedMethod === 'sqft'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Price Per Square Foot
          </button>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-700">Estimated Value</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(result.confidenceLevel)}`}>
              {result.confidenceLevel} Confidence
            </span>
          </div>
          <p className="text-4xl font-bold text-blue-900 mb-2">
            ${result.estimatedValue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Method: {result.method}</p>

          {result.estimatedValue !== property.price && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Compared to List Price:</span>
                <span className={`text-lg font-bold ${
                  result.estimatedValue > property.price ? 'text-green-600' : 'text-red-600'
                }`}>
                  {result.estimatedValue > property.price ? '+' : ''}
                  ${(result.estimatedValue - property.price).toLocaleString()}
                  ({(((result.estimatedValue - property.price) / property.price) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          )}
        </div>

        {result.breakdown && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Calculation Breakdown</h3>
            <div className="space-y-2">
              {result.breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-semibold">
                    {item.label.includes('$/sqft') || item.label.includes('sqft')
                      ? item.value.toLocaleString()
                      : item.label.includes('Properties')
                      ? item.value
                      : `$${item.value.toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedMethod === 'cma' && result.comparables && result.comparables.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">
              Comparables Used ({result.comparables.length})
            </h3>
            <div className="space-y-2">
              {result.comparables.map((comp, idx) => (
                <div key={comp.id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{comp.address}</p>
                    <p className="text-xs text-gray-600">
                      {comp.bedrooms} bed, {comp.bathrooms} bath, {comp.squareFeet.toLocaleString()} sqft
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${comp.adjustedPrice?.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">{comp.similarity}% match</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
