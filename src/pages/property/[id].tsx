import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import properties from '@/data/sample-properties.json';

export default function PropertyDetail() {
  const router = useRouter();
  const { id } = router.query;

  const property = properties.find(p => p.id === Number(id));

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Property Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{property.address} - Premium Real Estate</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Listings
            </Link>
          </div>
        </nav>

        {/* Property Details */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Image */}
          <div className="mb-8">
            <img
              src={property.image}
              alt={property.address}
              className="w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Property Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">{property.address}</h1>
                    <p className="text-xl text-gray-600">{property.city}</p>
                  </div>
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold">
                    {property.type}
                  </div>
                </div>

                <div className="text-4xl font-bold text-blue-600 mb-8">
                  ${property.price.toLocaleString()}
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <svg className="w-12 h-12 mx-auto text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <div className="text-3xl font-bold text-gray-800">{property.bedrooms}</div>
                    <div className="text-gray-600">Bedrooms</div>
                  </div>

                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <svg className="w-12 h-12 mx-auto text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div className="text-3xl font-bold text-gray-800">{property.bathrooms}</div>
                    <div className="text-gray-600">Bathrooms</div>
                  </div>

                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <svg className="w-12 h-12 mx-auto text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <div className="text-3xl font-bold text-gray-800">{property.sqft.toLocaleString()}</div>
                    <div className="text-gray-600">Square Feet</div>
                  </div>
                </div>

                {/* Description */}
                <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Description</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    This stunning {property.type.toLowerCase()} offers an exceptional living experience in the heart of {property.city}.
                    Featuring {property.bedrooms} spacious bedrooms and {property.bathrooms} luxurious bathrooms across {property.sqft.toLocaleString()} square feet
                    of meticulously designed living space.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    The property boasts high-end finishes throughout, an open floor plan perfect for entertaining, and abundant natural light.
                    Located in a prime neighborhood with excellent schools, shopping, and dining nearby.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    This is a rare opportunity to own a piece of luxury real estate in one of the most desirable locations.
                    Schedule your private showing today!
                  </p>
                </div>

                {/* Features List */}
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Features</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Central Air Conditioning</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Modern Kitchen</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Hardwood Floors</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Walk-in Closets</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Attached Garage</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Smart Home Features</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form & Documents */}
            <div className="lg:col-span-1">
              {/* Contact Agent */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 sticky top-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Contact Agent</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="I'm interested in this property..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Request Information
                  </button>
                </form>

                {/* Download Documents */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-800 mb-3">Property Documents</h4>
                  <button className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Offering Memorandum
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
