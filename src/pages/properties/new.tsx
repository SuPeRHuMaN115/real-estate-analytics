import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { PropertyForm, OMParser } from '@/components';
import { PropertyInput } from '@/types';

export default function NewPropertyPage() {
  const router = useRouter();
  const { parse } = router.query;
  const [showParser, setShowParser] = useState(parse === 'true');
  const [initialData, setInitialData] = useState<Partial<PropertyInput>>({
    isSubjectProperty: true,
  });

  const handleSubmit = async (data: PropertyInput) => {
    const response = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create property');
    }

    router.push(`/properties/${result.data.id}`);
  };

  const handleParsed = (data: Partial<PropertyInput>) => {
    setInitialData((prev) => ({
      ...prev,
      ...data,
      isSubjectProperty: true,
    }));
    setShowParser(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
        <p className="text-gray-600 mt-1">
          Enter property details or parse from an offering memorandum
        </p>
      </div>

      {/* Toggle Parser */}
      <div className="flex space-x-4">
        <button
          onClick={() => setShowParser(false)}
          className={`btn ${!showParser ? 'btn-primary' : 'btn-secondary'}`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setShowParser(true)}
          className={`btn ${showParser ? 'btn-primary' : 'btn-secondary'}`}
        >
          Parse Offering Memo (AI)
        </button>
      </div>

      {/* OM Parser */}
      {showParser && <OMParser onParsed={handleParsed} />}

      {/* Property Form */}
      <PropertyForm
        initialData={initialData}
        onSubmit={handleSubmit}
        submitLabel="Create Property"
      />
    </div>
  );
}
