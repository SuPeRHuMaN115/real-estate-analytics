import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PropertyCard } from '@/components';
import { Property } from '@/types';

interface DashboardStats {
  totalProperties: number;
  subjectProperties: number;
  comps: number;
  avgCapRate: number;
  totalValue: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    subjectProperties: 0,
    comps: 0,
    avgCapRate: 0,
    totalValue: 0,
  });
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/properties?limit=6');
      const result = await response.json();

      if (result.success) {
        const properties = result.data.properties as Property[];
        setRecentProperties(properties);

        // Calculate stats
        const subjects = properties.filter((p) => p.isSubjectProperty);
        const capRates = properties
          .filter((p) => p.capRate)
          .map((p) => p.capRate!);
        const avgCap =
          capRates.length > 0
            ? capRates.reduce((a, b) => a + b, 0) / capRates.length
            : 0;
        const totalVal = properties.reduce(
          (sum, p) => sum + (p.salePrice || p.listPrice || 0),
          0
        );

        setStats({
          totalProperties: result.data.total,
          subjectProperties: subjects.length,
          comps: result.data.total - subjects.length,
          avgCapRate: avgCap,
          totalValue: totalVal,
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) =>
    value ? `$${(value / 1000000).toFixed(1)}M` : '$0';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real Estate Comp Analysis Overview
          </p>
        </div>
        <Link href="/properties/new" className="btn btn-primary">
          Add Property
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-500">Total Properties</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalProperties}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-500">Subject Properties</p>
            <p className="text-3xl font-bold text-primary-600">
              {stats.subjectProperties}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-500">Comparable Sales</p>
            <p className="text-3xl font-bold text-gray-900">{stats.comps}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-500">Avg Cap Rate</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.avgCapRate > 0
                ? `${(stats.avgCapRate * 100).toFixed(2)}%`
                : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/properties/new"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <div className="text-4xl mb-2">+</div>
              <p className="font-medium text-gray-900">Add New Property</p>
              <p className="text-sm text-gray-500">
                Enter property details manually
              </p>
            </Link>

            <Link
              href="/properties/new?parse=true"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <div className="text-4xl mb-2">AI</div>
              <p className="font-medium text-gray-900">Parse Offering Memo</p>
              <p className="text-sm text-gray-500">
                Extract data from OM text
              </p>
            </Link>

            <Link
              href="/analysis"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <div className="text-4xl mb-2">$</div>
              <p className="font-medium text-gray-900">Run Analysis</p>
              <p className="text-sm text-gray-500">
                Analyze comps & generate valuation
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Properties */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Properties
          </h2>
          <Link
            href="/properties"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All →
          </Link>
        </div>

        {recentProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="card-body text-center py-12">
              <p className="text-gray-500">No properties yet.</p>
              <Link
                href="/properties/new"
                className="btn btn-primary mt-4 inline-block"
              >
                Add Your First Property
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
