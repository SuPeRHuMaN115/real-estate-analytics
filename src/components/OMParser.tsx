import React, { useState } from 'react';
import { PropertyInput } from '@/types';

interface OMParserProps {
  onParsed: (data: Partial<PropertyInput>) => void;
}

export default function OMParser({ onParsed }: OMParserProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleParse = async () => {
    if (!text.trim()) {
      setError('Please enter offering memorandum text');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/analysis/parse-om', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, createProperty: false }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to parse offering memorandum');
      }

      onParsed(result.data.parsedData);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold">Parse Offering Memorandum</h3>
        <p className="text-sm text-gray-500 mt-1">
          Paste the text from an offering memorandum and AI will extract the property
          details
        </p>
      </div>
      <div className="card-body space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Successfully extracted property data! The form has been populated with the
            extracted information.
          </div>
        )}

        <div>
          <label className="label">Offering Memorandum Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input font-mono text-sm"
            rows={10}
            placeholder="Paste the offering memorandum text here...

Example:
OFFERING MEMORANDUM

Sunset Gardens Apartments
123 Main Street, Austin, TX 78701

Property Overview:
- 150 Units
- Built in 1998, Renovated in 2020
- Class B Garden-Style Apartments
- 95% Occupied

Financials:
- Asking Price: $25,000,000
- Current NOI: $1,500,000
- Cap Rate: 6.0%
..."
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleParse}
            disabled={loading || !text.trim()}
            className="btn btn-primary"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Parsing with AI...
              </span>
            ) : (
              'Extract Property Data'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
