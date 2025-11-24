import Head from 'next/head';
import Link from 'next/link';
import properties from '@/data/sample-properties.json';
import PropertyCard from '@/components/PropertyCard';
import { getAveragePrice } from '@/utils/analysis';

export default function Home() {
  const avgPrice = getAveragePrice(properties);

  return (
    <>
      <Head>
        <title>Real Estate Analytics</title>
      </Head>
      <main className="p-8">
        {/* Game Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">🎮 Real Estate Tycoon</h2>
              <p className="text-blue-100">Build your property empire and become a millionaire!</p>
            </div>
            <Link
              href="/game"
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg text-lg"
            >
              Play Now →
            </Link>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Real Estate Listings</h1>
        <p className="mb-6">Average price: ${avgPrice.toLocaleString()}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </main>
    </>
  );
}
