import { Link } from 'react-router-dom';
import { ChevronLeft, Users, Bed, Bath, Wifi, Car, Utensils, Waves } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Accommodation {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  featuredImage?: string;
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  pricePerNight?: number;
  amenities?: string[];
}

function AccommodationsContent() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/content?type=accommodation');
        const data = await response.json();
        setAccommodations(data || []);
      } catch (error) {
        console.error('Error fetching accommodations:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </div>
          <h1
            id="accommodations-title"
            className="text-3xl font-bold text-gray-900 mt-4"
          >
            Accommodations
          </h1>
          <p
            id="accommodations-subtitle"
            className="text-gray-600 mt-2"
          >
            Discover our luxury lakeside accommodations
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {accommodations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No accommodation content available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {accommodations.map((accommodation) => (
              <div key={accommodation.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {accommodation.featuredImage && (
                  <div className="aspect-[16/10] bg-gray-200">
                    <img
                      src={accommodation.featuredImage}
                      alt={accommodation.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    {accommodation.title}
                  </h2>
                  
                  {accommodation.subtitle && (
                    <p className="text-lg text-gray-600 mb-4">
                      {accommodation.subtitle}
                    </p>
                  )}
                  
                  <p className="text-gray-700 mb-6">
                    {accommodation.content}
                  </p>

                  {/* Room Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {accommodation.maxGuests && (
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-600">
                          {accommodation.maxGuests} Guests
                        </span>
                      </div>
                    )}
                    {accommodation.bedrooms && (
                      <div className="flex items-center gap-2">
                        <Bed className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-600">
                          {accommodation.bedrooms} Bedroom{accommodation.bedrooms > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    {accommodation.bathrooms && (
                      <div className="flex items-center gap-2">
                        <Bath className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-600">
                          {accommodation.bathrooms} Bathroom{accommodation.bathrooms > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    {accommodation.pricePerNight && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          ${accommodation.pricePerNight}/night
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Amenities */}
                  {accommodation.amenities && accommodation.amenities.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Amenities</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {accommodation.amenities.map((amenity: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span className="text-sm text-gray-600">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Book Now
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Experience Ko Lake Villa?
          </h2>
          <p className="text-gray-600 mb-6">
            Contact us today to make your reservation and create unforgettable memories.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/contact" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </Link>
            <Link 
              to="/gallery" 
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-gray-400 transition-colors"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccommodationsPage() {
  return <AccommodationsContent />;
}