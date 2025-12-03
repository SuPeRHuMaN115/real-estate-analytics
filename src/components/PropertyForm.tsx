import React, { useState } from 'react';
import { PropertyInput, PropertyType, Condition, Quality } from '@/types';

interface PropertyFormProps {
  initialData?: Partial<PropertyInput>;
  onSubmit: (data: PropertyInput) => Promise<void>;
  submitLabel?: string;
}

export default function PropertyForm({
  initialData,
  onSubmit,
  submitLabel = 'Save Property',
}: PropertyFormProps) {
  const [formData, setFormData] = useState<Partial<PropertyInput>>({
    propertyType: 'MULTIFAMILY',
    isSubjectProperty: false,
    ...initialData,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    let parsedValue: string | number | boolean = value;

    if (type === 'number' && value) {
      parsedValue = parseFloat(value);
    } else if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => ({ ...prev, [name]: parsedValue || undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData as PropertyInput);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Basic Information</h3>
        </div>
        <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">Property Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Sunset Apartments"
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">City *</label>
            <input
              type="text"
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">State *</label>
            <input
              type="text"
              name="state"
              value={formData.state || ''}
              onChange={handleChange}
              className="input"
              maxLength={2}
              placeholder="TX"
              required
            />
          </div>

          <div>
            <label className="label">Zip Code *</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode || ''}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">County</label>
            <input
              type="text"
              name="county"
              value={formData.county || ''}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="label">Property Type *</label>
            <select
              name="propertyType"
              value={formData.propertyType || 'MULTIFAMILY'}
              onChange={handleChange}
              className="input"
              required
            >
              {Object.values(PropertyType).map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Property Sub-Type</label>
            <input
              type="text"
              name="propertySubType"
              value={formData.propertySubType || ''}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Garden-style, Mid-rise"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isSubjectProperty"
                checked={formData.isSubjectProperty || false}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                This is a subject property (not a comp)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Property Details</h3>
        </div>
        <div className="card-body grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Year Built</label>
            <input
              type="number"
              name="yearBuilt"
              value={formData.yearBuilt || ''}
              onChange={handleChange}
              className="input"
              min={1800}
              max={2030}
            />
          </div>

          <div>
            <label className="label">Year Renovated</label>
            <input
              type="number"
              name="yearRenovated"
              value={formData.yearRenovated || ''}
              onChange={handleChange}
              className="input"
              min={1800}
              max={2030}
            />
          </div>

          <div>
            <label className="label">Number of Units</label>
            <input
              type="number"
              name="units"
              value={formData.units || ''}
              onChange={handleChange}
              className="input"
              min={1}
            />
          </div>

          <div>
            <label className="label">Total Square Feet</label>
            <input
              type="number"
              name="squareFeet"
              value={formData.squareFeet || ''}
              onChange={handleChange}
              className="input"
              min={1}
            />
          </div>

          <div>
            <label className="label">Average Unit Size (SF)</label>
            <input
              type="number"
              name="avgUnitSize"
              value={formData.avgUnitSize || ''}
              onChange={handleChange}
              className="input"
              min={1}
            />
          </div>

          <div>
            <label className="label">Lot Size (Acres)</label>
            <input
              type="number"
              name="lotSizeAcres"
              value={formData.lotSizeAcres || ''}
              onChange={handleChange}
              className="input"
              step="0.01"
              min={0}
            />
          </div>

          <div>
            <label className="label">Condition</label>
            <select
              name="condition"
              value={formData.condition || ''}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select...</option>
              {Object.values(Condition).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Quality Class</label>
            <select
              name="quality"
              value={formData.quality || ''}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select...</option>
              {Object.values(Quality).map((q) => (
                <option key={q} value={q}>
                  {q.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Occupancy (%)</label>
            <input
              type="number"
              name="occupancy"
              value={formData.occupancy ? formData.occupancy * 100 : ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  occupancy: value ? value / 100 : undefined,
                }));
              }}
              className="input"
              min={0}
              max={100}
              step="0.1"
            />
          </div>
        </div>
      </div>

      {/* Financial Data */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Financial Data</h3>
        </div>
        <div className="card-body grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">List Price ($)</label>
            <input
              type="number"
              name="listPrice"
              value={formData.listPrice || ''}
              onChange={handleChange}
              className="input"
              min={0}
            />
          </div>

          <div>
            <label className="label">Sale Price ($)</label>
            <input
              type="number"
              name="salePrice"
              value={formData.salePrice || ''}
              onChange={handleChange}
              className="input"
              min={0}
            />
          </div>

          <div>
            <label className="label">Cap Rate (%)</label>
            <input
              type="number"
              name="capRate"
              value={formData.capRate ? formData.capRate * 100 : ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  capRate: value ? value / 100 : undefined,
                }));
              }}
              className="input"
              min={0}
              max={100}
              step="0.01"
            />
          </div>

          <div>
            <label className="label">Gross Potential Rent (Annual)</label>
            <input
              type="number"
              name="grossPotentialRent"
              value={formData.grossPotentialRent || ''}
              onChange={handleChange}
              className="input"
              min={0}
            />
          </div>

          <div>
            <label className="label">Effective Gross Income</label>
            <input
              type="number"
              name="effectiveGrossIncome"
              value={formData.effectiveGrossIncome || ''}
              onChange={handleChange}
              className="input"
              min={0}
            />
          </div>

          <div>
            <label className="label">Other Income</label>
            <input
              type="number"
              name="otherIncome"
              value={formData.otherIncome || ''}
              onChange={handleChange}
              className="input"
              min={0}
            />
          </div>

          <div>
            <label className="label">Vacancy Rate (%)</label>
            <input
              type="number"
              name="vacancyRate"
              value={formData.vacancyRate ? formData.vacancyRate * 100 : ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  vacancyRate: value ? value / 100 : undefined,
                }));
              }}
              className="input"
              min={0}
              max={100}
              step="0.1"
            />
          </div>

          <div>
            <label className="label">Operating Expenses</label>
            <input
              type="number"
              name="operatingExpenses"
              value={formData.operatingExpenses || ''}
              onChange={handleChange}
              className="input"
              min={0}
            />
          </div>

          <div>
            <label className="label">NOI (Net Operating Income)</label>
            <input
              type="number"
              name="noi"
              value={formData.noi || ''}
              onChange={handleChange}
              className="input"
              min={0}
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Additional Information</h3>
        </div>
        <div className="card-body space-y-4">
          <div>
            <label className="label">Amenities</label>
            <input
              type="text"
              name="amenities"
              value={formData.amenities || ''}
              onChange={handleChange}
              className="input"
              placeholder="Pool, Fitness Center, Clubhouse..."
            />
          </div>

          <div>
            <label className="label">Data Source</label>
            <input
              type="text"
              name="source"
              value={formData.source || ''}
              onChange={handleChange}
              className="input"
              placeholder="e.g., CoStar, LoopNet, Broker"
            />
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              className="input"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
