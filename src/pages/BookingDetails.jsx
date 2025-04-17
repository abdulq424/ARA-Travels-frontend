import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookings } from '../services/api';
import { toast } from 'react-toastify';

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin', { state: { from: `/booking-details/${id}` } });
      return;
    }
    fetchBookingDetails();
  }, [id, navigate]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await bookings.getById(id);
      console.log(response.data.booking);
      setBooking(response.data.booking);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/signin', { state: { from: `/booking-details/${id}` } });
        return;
      }
      setError('Failed to fetch booking details. Please try again later.');
      console.error('Error fetching booking details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      await bookings.cancel(id);
      toast.success('Booking cancelled successfully');
      navigate('/my-bookings');
    } catch (err) {
      setError('Failed to cancel booking. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => navigate('/my-bookings')}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Back to My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-600">Booking not found</p>
            <button
              onClick={() => navigate('/my-bookings')}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Back to My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Booking Details</h1>
            {booking.status !== 'Cancelled' && (
              <button
                onClick={handleCancelBooking}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel Booking
              </button>
            )}
          </div>

          {/* Flight Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Flight Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600">Airline</p>
                <p className="font-semibold">{booking.flight.airline}</p>
              </div>
              <div>
                <p className="text-gray-600">Flight Number</p>
                <p className="font-semibold">{booking.flight.flightNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">From</p>
                <p className="font-semibold">{booking.flight.origin}</p>
                <p className="text-gray-600">
                  {new Date(booking.flight.departureDate).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">To</p>
                <p className="font-semibold">{booking.flight.destination}</p>
                <p className="text-gray-600">
                  {new Date(booking.flight.arrivalDate).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Duration</p>
                <p className="font-semibold">{booking.flight.duration}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-primary-600">
                  ${booking.totalAmount}
                </p>
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Passenger Information</h2>
            <div className="space-y-4">
              {booking.passengers.map((passenger, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Passenger {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-semibold">{passenger.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Age</p>
                      <p className="font-semibold">{passenger.age}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Seat</p>
                      <p className="font-semibold">{passenger.seatNumber} ({passenger.seatClass})</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Status */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600">Booking ID</p>
                <p className="font-semibold">{booking._id}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className={`font-semibold ${
                  booking.status === 'Confirmed' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {booking.status}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Payment Status</p>
                <p className={`font-semibold ${
                  booking.paymentStatus === 'Completed' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {booking.paymentStatus}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Booking Date</p>
                <p className="font-semibold">
                  {new Date(booking.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => navigate('/my-bookings')}
              className="px-4 py-2 text-primary-600 hover:text-primary-800"
            >
              ← Back to My Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetails; 