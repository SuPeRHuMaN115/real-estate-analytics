import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ComparisonTable, ValuationReport } from '@/components';
import { Property, CompAnalysis, Valuation } from '@/types';

interface AnalysisResult {
  subject: Property;
  analyses: (CompAnalysis & { comp: Property })[];
  aiAnalysis?: {
    summary: string;
    valuationSummary: string;
    confidence: number;
  };
}

export default function AnalysisPage() {
  const router = useRouter();
  const { subject: subjectId } = router.query;

  const [subjects, setSubjects] = useState<Property[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [comps, setComps] = useState<Property[]>([]);
  const [selectedComps, setSelectedComps] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [valuation, setValuation] = useState<Valuation | null>(null);
  const [loading, setLoading] = useState(false);
  const [valuationLoading, setValuationLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (subjectId && typeof subjectId === 'string') {
      setSelectedSubject(subjectId);
    }
  }, [subjectId]);

  const fetchProperties = async () => {
    try {
      const [subjectRes, compRes] = await Promise.all([
        fetch('/api/properties?isSubject=true&limit=100'),
        fetch('/api/properties?isSubject=false&limit=100'),
      ]);

      const subjectData = await subjectRes.json();
      const compData = await compRes.json();

      if (subjectData.success) {
        setSubjects(subjectData.data.properties);
      }
      if (compData.success) {
        setComps(compData.data.properties);
      }
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    }
  };

  const runAnalysis = async () => {
    if (!selectedSubject) {
      setError('Please select a subject property');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysisResult(null);
    setValuation(null);

    try {
      const response = await fetch('/api/analysis/comps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectPropertyId: selectedSubject,
          compPropertyIds: selectedComps.length > 0 ? selectedComps : undefined,
          autoFindComps: selectedComps.length === 0,
          maxComps: 5,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setAnalysisResult(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const runValuation = async () => {
    if (!selectedSubject) return;

    setValuationLoading(true);

    try {
      const response = await fetch('/api/analysis/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: selectedSubject,
          includeComps: true,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setValuation(result.data.valuation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Valuation failed');
    } finally {
      setValuationLoading(false);
    }
  };

  const toggleComp = (id: string) => {
    setSelectedComps((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Comp Analysis</h1>
        <p className="text-gray-600 mt-1">
          Analyze comparable properties and generate valuations
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Subject Selection */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold">1. Select Subject Property</h2>
        </div>
        <div className="card-body">
          {subjects.length > 0 ? (
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input"
            >
              <option value="">Select a subject property...</option>
              {subjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name || p.address} - {p.city}, {p.state}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-500">
              No subject properties found.{' '}
              <a href="/properties/new" className="text-primary-600 underline">
                Add one first
              </a>
              .
            </p>
          )}
        </div>
      </div>

      {/* Comp Selection */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold">
            2. Select Comparable Properties (Optional)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Leave empty to auto-find the best comps
          </p>
        </div>
        <div className="card-body">
          {comps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {comps.map((p) => (
                <label
                  key={p.id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedComps.includes(p.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedComps.includes(p.id)}
                    onChange={() => toggleComp(p.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-sm">{p.address}</p>
                    <p className="text-xs text-gray-500">
                      {p.city}, {p.state} |{' '}
                      {p.salePrice
                        ? `$${p.salePrice.toLocaleString()}`
                        : 'No price'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No comparable properties found.{' '}
              <a href="/properties/new" className="text-primary-600 underline">
                Add some comps
              </a>
              .
            </p>
          )}

          {selectedComps.length > 0 && (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedComps.length} comp(s) selected
              </p>
              <button
                onClick={() => setSelectedComps([])}
                className="text-sm text-primary-600 hover:underline"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Run Analysis */}
      <div className="flex space-x-4">
        <button
          onClick={runAnalysis}
          disabled={!selectedSubject || loading}
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
              Analyzing...
            </span>
          ) : (
            'Run Comp Analysis'
          )}
        </button>

        {analysisResult && (
          <button
            onClick={runValuation}
            disabled={valuationLoading}
            className="btn btn-success"
          >
            {valuationLoading ? 'Generating...' : 'Generate Valuation'}
          </button>
        )}
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Comparison Analysis</h2>
            </div>
            <div className="card-body">
              <ComparisonTable
                subject={analysisResult.subject}
                analyses={analysisResult.analyses}
              />
            </div>
          </div>

          {/* AI Analysis Summary */}
          {analysisResult.aiAnalysis && (
            <div className="card">
              <div className="card-header bg-purple-50">
                <h2 className="text-lg font-semibold text-purple-900">
                  AI Analysis Summary
                </h2>
              </div>
              <div className="card-body space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Analysis</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {analysisResult.aiAnalysis.summary}
                  </p>
                </div>
                {analysisResult.aiAnalysis.valuationSummary && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Valuation Opinion
                    </h3>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {analysisResult.aiAnalysis.valuationSummary}
                    </p>
                  </div>
                )}
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">
                    AI Confidence:{' '}
                    <span className="font-medium">
                      {analysisResult.aiAnalysis.confidence}%
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Valuation Report */}
      {valuation && analysisResult && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Valuation Report
          </h2>
          <ValuationReport
            valuation={valuation}
            property={analysisResult.subject}
          />
        </div>
      )}
    </div>
  );
}
