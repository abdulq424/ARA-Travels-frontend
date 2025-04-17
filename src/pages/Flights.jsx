import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { flights } from '../services/api';

function Flights() {
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    class: 'Economy',
    airline: '',
    minPrice: '',
    maxPrice: '',
    searchType: 'general' // 'general', 'airline', 'price', 'date'
  });
  const [flightsList, setFlightsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      let response;

      console.log(searchParams);
      
      switch (searchParams.searchType) {
        case 'airline':
          const ParamsAirline = { airline : searchParams.airline}
          response = await flights.search(ParamsAirline);
          break;
        case 'price':
          const ParamsPrice = {minPrice : searchParams.minPrice , maxPrice : searchParams.maxPrice}
          response = await flights.search(ParamsPrice);
          break;
        case 'date':
          const ParamsDate = {departureDate:searchParams.departureDate}
          response = await flights.search(ParamsDate);
          break;
        default:
          response = await flights.search(searchParams);
      }
      
      // Ensure we're setting an array, even if empty
      setFlightsList(Array.isArray(response.data.flights) ? response.data.flights : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch flights. Please try again later.');
      console.error('Error fetching flights:', err);
      setFlightsList([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFlights();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchTypeChange = (type) => {
    setSearchParams(prev => ({
      ...prev,
      searchType: type
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
      <div className="container mx-auto px-4">
        {/* Search Type Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handleSearchTypeChange('general')}
            className={`px-4 py-2 rounded-lg ${
              searchParams.searchType === 'general'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            General Search
          </button>
          <button
            onClick={() => handleSearchTypeChange('airline')}
            className={`px-4 py-2 rounded-lg ${
              searchParams.searchType === 'airline'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            By Airline
          </button>
          <button
            onClick={() => handleSearchTypeChange('price')}
            className={`px-4 py-2 rounded-lg ${
              searchParams.searchType === 'price'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            By Price
          </button>
          <button
            onClick={() => handleSearchTypeChange('date')}
            className={`px-4 py-2 rounded-lg ${
              searchParams.searchType === 'date'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            By Date
          </button>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {searchParams.searchType === 'general' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <input
                    type="text"
                    name="origin"
                    value={searchParams.origin}
                    onChange={handleInputChange}
                    placeholder="City or Airport"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="text"
                    name="destination"
                    value={searchParams.destination}
                    onChange={handleInputChange}
                    placeholder="City or Airport"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
                  <input
                    type="date"
                    name="departureDate"
                    value={searchParams.departureDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
                  <input
                    type="date"
                    name="returnDate"
                    value={searchParams.returnDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    name="class"
                    value={searchParams.class}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First Class</option>
                  </select>
                </div>
              </>
            )}

            {searchParams.searchType === 'airline' && (
              <div className="md:col-span-3 lg:col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Airline</label>
                <input
                  type="text"
                  name="airline"
                  value={searchParams.airline}
                  onChange={handleInputChange}
                  placeholder="Enter airline name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            )}

            {searchParams.searchType === 'price' && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                  <input
                    type="number"
                    name="minPrice"
                    value={searchParams.minPrice}
                    onChange={handleInputChange}
                    placeholder="Minimum price"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={searchParams.maxPrice}
                    onChange={handleInputChange}
                    placeholder="Maximum price"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </>
            )}

            {searchParams.searchType === 'date' && (
              <div className="md:col-span-3 lg:col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="departureDate"
                  value={searchParams.departureDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            )}

            <div className="md:col-span-3 lg:col-span-5 flex justify-center">
              <button
                type="submit"
                className="btn-primary px-6 py-2"
              >
                Search Flights
              </button>
            </div>
          </form>
        </div>

        {/* Flights List */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading flights...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
              </div>
            ) : flightsList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No flights found matching your criteria.</p>
              </div>
            ) : (
              flightsList.map((flight) => {
                // Calculate minimum price from available seats
                const availableSeats = flight.seats.filter(seat => seat.isAvailable);
                const minPrice = availableSeats.length > 0 
                  ? Math.min(...availableSeats.map(seat => seat.price))
                  : null;

                return (
                  <div key={flight._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800">{flight.airline}</h3>
                        <p className="text-gray-600">Flight: {flight.flightNumber}</p>
                        <div className="mt-2">
                          <p className="text-gray-700">
                            {flight.origin} → {flight.destination}
                          </p>
                          <p className="text-gray-600 mt-1">
                            Departure: {new Date(flight.departureDate).toLocaleDateString('en-PK', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                        <p className="text-sm text-gray-600">Starting from</p>
                        {minPrice ? (
                          <p className="text-2xl font-bold text-primary-600">
                            PKR {minPrice.toLocaleString('en-PK')}
                          </p>
                        ) : (
                          <p className="text-lg text-red-600">Sold Out</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          {availableSeats.length} seats available
                        </p>
                        <Link
                          to={`/booking/${flight._id}`}
                          className="btn-primary mt-3 inline-block"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Flights; 