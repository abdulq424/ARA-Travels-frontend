import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { flights, bookings } from '../services/api';
import { toast } from 'react-hot-toast';

function Booking() {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passengers, setPassengers] = useState([{
    name: '',
    age: '',
    seatNumber: '',
    seatClass: 'Economy'
  }]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchFlightDetails();
  }, [flightId]);

  const fetchFlightDetails = async () => {
    try {
      setLoading(true);
      const response = await flights.getById(flightId);
      setFlight(response.data.flight);
      console.log(response.data.flight);
      setError('');
    } catch (err) {
      toast.error('Failed to fetch flight details. Please try again later.');
      //setError('Failed to fetch flight details. Please try again later.');
      console.error('Error fetching flight:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
      // Reset seat number when class changes
      ...(field === 'seatClass' && { seatNumber: '' })
    };
    setPassengers(updatedPassengers);
    calculateTotalAmount(updatedPassengers);
  };

  const addPassenger = () => {
    setPassengers([...passengers, {
      name: '',
      age: '',
      seatNumber: '',
      seatClass: 'Economy'
    }]);
  };

  const removePassenger = (index) => {
    const updatedPassengers = passengers.filter((_, i) => i !== index);
    setPassengers(updatedPassengers);
    calculateTotalAmount(updatedPassengers);
  };

  const getAvailableSeats = (seatClass) => {
    if (!flight || !flight.seats) return [];
    return flight.seats.filter(seat => 
      seat.class === seatClass && 
      seat.isAvailable && 
      !passengers.some(p => p.seatNumber === seat.number)
    );
  };

  const calculateTotalAmount = (passengersList) => {
    if (!flight || !flight.seats) return;
    
    let total = 0;
    passengersList.forEach(passenger => {
      if (passenger.seatNumber) {
        const seat = flight.seats.find(s => s.number === passenger.seatNumber);
        if (seat) {
          total += seat.price;
        }
      }
    });
    setTotalAmount(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const isValid = passengers.every(passenger => 
      passenger.name && 
      passenger.age && 
      passenger.seatNumber && 
      passenger.seatClass
    );

    if (!isValid) {
      toast.error('Please fill in all passenger details');
      return;
    }

    try {
      setLoading(true);
      const response = await bookings.create({
        flightId,
        passengers,
        totalAmount
      });
      toast.success('Booking created successfully!');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking. Please try again.');
      //setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/flights')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Back to Flights
          </button>
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <p className="text-gray-600">Flight not found</p>
          <button
            onClick={() => navigate('/flights')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Back to Flights
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
      <div className="container mx-auto px-4">
        {/* Flight Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Flight Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600">Airline</p>
              <p className="font-semibold">{flight.airline}</p>
            </div>
            <div>
              <p className="text-gray-600">Flight Number</p>
              <p className="font-semibold">{flight.flightNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Duration</p>
              <p className="font-semibold">{flight.duration}</p>
            </div>
            <div>
              <p className="text-gray-600">From</p>
              <p className="font-semibold">{flight.origin}</p>
              <p className="text-gray-600">{new Date(flight.departureDate).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">To</p>
              <p className="font-semibold">{flight.destination}</p>
              <p className="text-gray-600">{new Date(flight.arrivalDate).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Passenger Details</h2>
          <form onSubmit={handleSubmit}>
            {passengers.map((passenger, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Passenger {index + 1}</h3>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removePassenger(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={passenger.name}
                      onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={passenger.age}
                      onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seat Class</label>
                    <select
                      value={passenger.seatClass}
                      onChange={(e) => handlePassengerChange(index, 'seatClass', e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white appearance-none cursor-pointer hover:border-primary-400 transition-colors duration-200"
                    >
                      <option value="Economy" className="py-2">Economy</option>
                      <option value="Business" className="py-2">Business</option>
                      <option value="First" className="py-2">First Class</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seat Number</label>
                    <select
                      value={passenger.seatNumber}
                      onChange={(e) => handlePassengerChange(index, 'seatNumber', e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white appearance-none cursor-pointer hover:border-primary-400 transition-colors duration-200"
                    >
                      {passenger.seatNumber ? (
                        <option value={passenger.seatNumber}>Selected Seat: {passenger.seatNumber}</option>
                      ) : (
                        <option value="">Select a seat</option>
                      )}
                      {getAvailableSeats(passenger.seatClass).length > 0 ? (
                        getAvailableSeats(passenger.seatClass)
                          .filter(seat => seat.number !== passenger.seatNumber)
                          .map(seat => (
                            <option 
                              key={seat.number} 
                              value={seat.number}
                              className={`py-2`}
                            >
                              Seat {seat.number} - ${seat.price}
                            </option>
                          ))
                      ) : (
                        <option value="" disabled className="text-red-500">
                          No seats available for {passenger.seatClass} class
                        </option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={addPassenger}
                className="px-4 py-2 text-primary-600 hover:text-primary-800"
              >
                + Add Another Passenger
              </button>
              <div className="text-right">
                <p className="text-gray-600 mb-2">Total Amount</p>
                <p className="text-2xl font-bold text-primary-600">PKR{totalAmount}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Booking; 