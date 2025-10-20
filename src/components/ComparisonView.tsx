import { Property, ComparableProperty } from '@/types';
import { findComparables } from '@/utils/analysis';

interface ComparisonViewProps {
  subjectProperty: Property;
  allProperties: Property[];
}

export default function ComparisonView({ subjectProperty, allProperties }: ComparisonViewProps) {
  const comparables = findComparables(subjectProperty, allProperties, 5);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Comparable Properties Analysis</h2>

      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Subject Property</h3>
        <p className="font-medium">{subjectProperty.address}</p>
        <p className="text-sm text-gray-600">
          {subjectProperty.city}, {subjectProperty.state} {subjectProperty.zipCode}
        </p>
        <div className="mt-2 flex gap-4 text-sm">
          <span>{subjectProperty.bedrooms} bed</span>
          <span>{subjectProperty.bathrooms} bath</span>
          <span>{subjectProperty.squareFeet.toLocaleString()} sqft</span>
          <span>Built {subjectProperty.yearBuilt}</span>
        </div>
        <p className="mt-2 text-xl font-bold">${subjectProperty.price.toLocaleString()}</p>
      </div>

      {comparables.length === 0 ? (
        <p className="text-gray-600 text-center py-8">
          No comparable properties found. Try adjusting your criteria.
        </p>
      ) : (
        <div className="space-y-4">
          {comparables.map((comp, index) => (
            <div key={comp.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
                      Comp #{index + 1}
                    </span>
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${
                      comp.similarity >= 80 ? 'bg-green-100 text-green-800' :
                      comp.similarity >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {comp.similarity}% Match
                    </span>
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${
                      comp.status === 'Sold' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {comp.status}
                    </span>
                  </div>
                  <p className="font-medium">{comp.address}</p>
                  <p className="text-sm text-gray-600">
                    {comp.city}, {comp.state} {comp.zipCode}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${comp.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">${Math.round(comp.price / comp.squareFeet)}/sqft</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-600">Beds:</span>
                  <span className="ml-1 font-semibold">{comp.bedrooms}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-600">Baths:</span>
                  <span className="ml-1 font-semibold">{comp.bathrooms}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-600">Sqft:</span>
                  <span className="ml-1 font-semibold">{comp.squareFeet.toLocaleString()}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-600">Built:</span>
                  <span className="ml-1 font-semibold">{comp.yearBuilt}</span>
                </div>
              </div>

              {comp.adjustments && comp.adjustments.length > 0 && (
                <div className="border-t pt-3 mt-3">
                  <p className="text-sm font-semibold mb-2 text-gray-700">Price Adjustments:</p>
                  <div className="space-y-1">
                    {comp.adjustments.map((adj, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {adj.factor}: {adj.description}
                        </span>
                        <span className={`font-semibold ${adj.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {adj.amount >= 0 ? '+' : ''}{adj.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-bold pt-2 border-t">
                      <span>Adjusted Price:</span>
                      <span className="text-blue-600">${comp.adjustedPrice?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
