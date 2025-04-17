import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookings } from '../services/api';
import { toast } from 'react-hot-toast';

function MyBookings() {
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookings.getMyBookings();
      setBookingsList(response.data.bookings);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again later.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookings.cancel(bookingId);
      toast.success('Booking cancelled successfully');
      // Refresh the bookings list
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
      console.error('Error canceling booking:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : bookingsList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">You have no bookings yet.</p>
            <Link to="/flights" className="btn-primary mt-4 inline-block">
              Book a Flight
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookingsList.map((booking) => (
              <div key={booking._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{booking.flight.airline}</h3>
                    <p className="text-gray-600">Flight #{booking.flight.flightNumber}</p>
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
                  <div className="flex flex-col items-end justify-between">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">
                        ${booking.totalAmount}
                      </p>
                      <p className="text-gray-600">
                        {booking.passengers.length} {booking.passengers.length === 1 ? 'Passenger' : 'Passengers'}
                      </p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Link
                        to={`/booking-details/${booking._id}`}
                        className="btn-primary"
                      >
                        View Details
                      </Link>
                      {booking.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="btn-danger"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings; 