import React from 'react';
import { CompAnalysis, Property } from '@/types';

interface ComparisonTableProps {
  subject: Property;
  analyses: (CompAnalysis & { comp: Property })[];
}

export default function ComparisonTable({
  subject,
  analyses,
}: ComparisonTableProps) {
  const formatCurrency = (value?: number) =>
    value ? `$${value.toLocaleString()}` : '-';

  const formatPercent = (value?: number) =>
    value !== undefined ? `${(value * 100).toFixed(2)}%` : '-';

  const formatAdjustment = (value?: number) => {
    if (!value) return '-';
    const sign = value > 0 ? '+' : '';
    return `${sign}$${value.toLocaleString()}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Property
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subject
            </th>
            {analyses.map((a, i) => (
              <th
                key={a.id}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Comp {i + 1}
                {a.similarityScore && (
                  <span className="ml-1 text-primary-600">
                    ({a.similarityScore.toFixed(0)}%)
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Address */}
          <tr>
            <td className="px-4 py-2 text-sm font-medium text-gray-900">Address</td>
            <td className="px-4 py-2 text-sm text-gray-600">
              {subject.address}, {subject.city}
            </td>
            {analyses.map((a) => (
              <td key={a.id} className="px-4 py-2 text-sm text-gray-600">
                {a.comp.address}, {a.comp.city}
              </td>
            ))}
          </tr>

          {/* Sale Price */}
          <tr className="bg-gray-50">
            <td className="px-4 py-2 text-sm font-medium text-gray-900">Sale Price</td>
            <td className="px-4 py-2 text-sm font-semibold text-gray-900">
              {formatCurrency(subject.salePrice || subject.listPrice)}
            </td>
            {analyses.map((a) => (
              <td key={a.id} className="px-4 py-2 text-sm text-gray-600">
                {formatCurrency(a.comp.salePrice || a.comp.listPrice)}
              </td>
            ))}
          </tr>

          {/* Price Per Unit */}
          <tr>
            <td className="px-4 py-2 text-sm font-medium text-gray-900">Price/Unit</td>
            <td className="px-4 py-2 text-sm text-gray-600">
              {formatCurrency(subject.pricePerUnit)}
            </td>
            {analyses.map((a) => (
              <td key={a.id} className="px-4 py-2 text-sm text-gray-600">
                {formatCurrency(a.comp.pricePerUnit)}
              </td>
            ))}
          </tr>

          {/* Units */}
          <tr className="bg-gray-50">
            <td className="px-4 py-2 text-sm font-medium text-gray-900">Units</td>
            <td className="px-4 py-2 text-sm text-gray-600">{subject.units || '-'}</td>
            {analyses.map((a) => (
              <td key={a.id} className="px-4 py-2 text-sm text-gray-600">
                {a.comp.units || '-'}
              </td>
            ))}
          </tr>

          {/* Year Built */}
          <tr>
            <td className="px-4 py-2 text-sm font-medium text-gray-900">Year Built</td>
            <td className="px-4 py-2 text-sm text-gray-600">
              {subject.yearBuilt || '-'}
            </td>
            {analyses.map((a) => (
              <td key={a.id} className="px-4 py-2 text-sm text-gray-600">
                {a.comp.yearBuilt || '-'}
              </td>
            ))}
          </tr>

          {/* Cap Rate */}
          <tr className="bg-gray-50">
            <td className="px-4 py-2 text-sm font-medium text-gray-900">Cap Rate</td>
            <td className="px-4 py-2 text-sm text-gray-600">
              {formatPercent(subject.capRate)}
            </td>
            {analyses.map((a) => (
              <td key={a.id} className="px-4 py-2 text-sm text-gray-600">
                {formatPercent(a.comp.capRate)}
              </td>
            ))}
          </tr>

          {/* Adjustments Section */}
          <tr>
            <td
              colSpan={analyses.length + 2}
              className="px-4 py-3 text-sm font-semibold text-gray-900 bg-primary-50"
            >
              Adjustments
            </td>
          </tr>

          {/* Size Adjustment */}
          <tr>
            <td className="px-4 py-2 text-sm font-medium text-gray-900">Size Adj.</td>
            <td className="px-4 py-2 text-sm text-gray-400">-</td>
            {analyses.map((a) => (
              <td
                key={a.id}
                className={`px-4 py-2 text-sm ${
                  (a.sizeAdj || 0) > 0
                    ? 'text-green-600'
                    : (a.sizeAdj || 0) < 0
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {formatAdjustment(a.sizeAdj)}
              </td>
            ))}
          </tr>

          {/* Age Adjustment */}
          <tr className="bg-gray-50">
            <td className="px-4 py-2 text-sm font-medium text-gray-900">Age Adj.</td>
            <td className="px-4 py-2 text-sm text-gray-400">-</td>
            {analyses.map((a) => (
              <td
                key={a.id}
                className={`px-4 py-2 text-sm ${
                  (a.ageAdj || 0) > 0
                    ? 'text-green-600'
                    : (a.ageAdj || 0) < 0
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {formatAdjustment(a.ageAdj)}
              </td>
            ))}
          </tr>

          {/* Condition Adjustment */}
          <tr>
            <td className="px-4 py-2 text-sm font-medium text-gray-900">
              Condition Adj.
            </td>
            <td className="px-4 py-2 text-sm text-gray-400">-</td>
            {analyses.map((a) => (
              <td
                key={a.id}
                className={`px-4 py-2 text-sm ${
                  (a.conditionAdj || 0) > 0
                    ? 'text-green-600'
                    : (a.conditionAdj || 0) < 0
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {formatAdjustment(a.conditionAdj)}
              </td>
            ))}
          </tr>

          {/* Total Adjustment */}
          <tr className="bg-primary-50">
            <td className="px-4 py-2 text-sm font-semibold text-gray-900">
              Total Adjustment
            </td>
            <td className="px-4 py-2 text-sm text-gray-400">-</td>
            {analyses.map((a) => (
              <td
                key={a.id}
                className={`px-4 py-2 text-sm font-semibold ${
                  (a.totalAdj || 0) > 0
                    ? 'text-green-600'
                    : (a.totalAdj || 0) < 0
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {formatAdjustment(a.totalAdj)}
              </td>
            ))}
          </tr>

          {/* Adjusted Price */}
          <tr className="bg-green-50">
            <td className="px-4 py-2 text-sm font-semibold text-gray-900">
              Adjusted Price
            </td>
            <td className="px-4 py-2 text-sm text-gray-400">-</td>
            {analyses.map((a) => (
              <td key={a.id} className="px-4 py-2 text-sm font-semibold text-green-700">
                {formatCurrency(a.adjustedPrice)}
              </td>
            ))}
          </tr>

          {/* Adjusted Price Per Unit */}
          <tr>
            <td className="px-4 py-2 text-sm font-medium text-gray-900">
              Adj. Price/Unit
            </td>
            <td className="px-4 py-2 text-sm text-gray-400">-</td>
            {analyses.map((a) => (
              <td key={a.id} className="px-4 py-2 text-sm text-gray-600">
                {formatCurrency(a.adjustedPpu)}
              </td>
            ))}
          </tr>

          {/* AI Notes */}
          {analyses.some((a) => a.aiNotes) && (
            <tr>
              <td
                colSpan={analyses.length + 2}
                className="px-4 py-3 text-sm font-semibold text-gray-900 bg-purple-50"
              >
                AI Analysis Notes
              </td>
            </tr>
          )}
          {analyses.some((a) => a.aiNotes) && (
            <tr>
              <td className="px-4 py-2 text-sm font-medium text-gray-900">Notes</td>
              <td className="px-4 py-2 text-sm text-gray-400">-</td>
              {analyses.map((a) => (
                <td key={a.id} className="px-4 py-2 text-sm text-gray-600">
                  {a.aiNotes || '-'}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
