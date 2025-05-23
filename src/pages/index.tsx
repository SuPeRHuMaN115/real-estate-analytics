import Head from 'next/head';
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
