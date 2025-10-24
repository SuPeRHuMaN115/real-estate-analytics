import Head from 'next/head';
import { useState, useMemo } from 'react';
import propertiesData from '@/data/sample-properties.json';
import PropertyCard from '@/components/PropertyCard';
import FilterPanel from '@/components/FilterPanel';
import ComparisonView from '@/components/ComparisonView';
import ValuationCalculator from '@/components/ValuationCalculator';
import { Property, PropertyFilters } from '@/types';
import { filterProperties, getMarketStats } from '@/utils/analysis';

export default function Home() {
  const [properties] = useState<Property[]>(propertiesData as Property[]);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState<'listings' | 'compare' | 'valuation'>('listings');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = useMemo(() => {
    let filtered = filterProperties(properties, filters);

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.address.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query) ||
        p.zipCode.includes(query)
      );
    }

    return filtered;
  }, [properties, filters, searchQuery]);

  const stats = useMemo(() => getMarketStats(filteredProperties), [filteredProperties]);

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setActiveTab('compare');
  };

  const handleValuationRequest = (property: Property) => {
    setSelectedProperty(property);
    setActiveTab('valuation');
  };

  return (
    <>
      <Head>
        <title>Real Estate Comps & Valuation App</title>
        <meta name="description" content="Track comparable properties and perform valuations" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Real Estate Comps & Valuation</h1>
            <p className="mt-1 text-sm text-gray-600">
              Analyze comparable properties and calculate accurate valuations
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Market Stats Banner */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Market Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Properties</p>
                <p className="text-2xl font-bold text-gray-900">{stats.count}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Avg Price</p>
                <p className="text-2xl font-bold text-gray-900">${(stats.avgPrice / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Median Price</p>
                <p className="text-2xl font-bold text-gray-900">${(stats.medianPrice / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Avg $/sqft</p>
                <p className="text-2xl font-bold text-gray-900">${stats.avgPricePerSqft}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Avg Sqft</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgSquareFeet.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Avg DOM</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgDaysOnMarket}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <nav className="flex border-b">
              <button
                onClick={() => setActiveTab('listings')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'listings'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Property Listings
              </button>
              <button
                onClick={() => {
                  if (!selectedProperty) {
                    alert('Please select a property first');
                    setActiveTab('listings');
                  } else {
                    setActiveTab('compare');
                  }
                }}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'compare'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Compare Properties
              </button>
              <button
                onClick={() => {
                  if (!selectedProperty) {
                    alert('Please select a property first');
                    setActiveTab('listings');
                  } else {
                    setActiveTab('valuation');
                  }
                }}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'valuation'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Valuation Calculator
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'listings' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <FilterPanel filters={filters} onFilterChange={setFilters} />
              </div>

              {/* Property Grid */}
              <div className="lg:col-span-3">
                {/* Search Bar */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search by address, city, or zip code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Results Count */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
                  </p>
                </div>

                {/* Property Cards */}
                {filteredProperties.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <p className="text-gray-600 text-lg">No properties match your criteria</p>
                    <button
                      onClick={() => {
                        setFilters({});
                        setSearchQuery('');
                      }}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                      <div key={property.id} className="relative group">
                        <PropertyCard property={property} />
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handlePropertySelect(property)}
                            className="px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            View Comps
                          </button>
                          <button
                            onClick={() => handleValuationRequest(property)}
                            className="px-3 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            Get Valuation
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'compare' && selectedProperty && (
            <div>
              <button
                onClick={() => setActiveTab('listings')}
                className="mb-4 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                ← Back to Listings
              </button>
              <ComparisonView subjectProperty={selectedProperty} allProperties={properties} />
            </div>
          )}

          {activeTab === 'valuation' && selectedProperty && (
            <div>
              <button
                onClick={() => setActiveTab('listings')}
                className="mb-4 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                ← Back to Listings
              </button>
              <ValuationCalculator property={selectedProperty} allProperties={properties} />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-600">
              Real Estate Comps & Valuation App - Powered by CMA and Market Analysis
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
