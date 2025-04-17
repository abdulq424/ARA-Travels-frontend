import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20 text-center animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary-800 mb-4 sm:mb-6">
          Welcome to ARA Travels
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
          Your trusted partner for safe and secure flight bookings. Experience the future of travel with our advanced security features and seamless booking process.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
          <Link 
            to="/signin" 
            className="btn-primary animate-slide-up w-full sm:w-auto"
          >
            Sign In
          </Link>
          <Link 
            to="/signup" 
            className="btn-secondary animate-slide-up w-full sm:w-auto"
          >
            Sign Up
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary-800 mb-8 sm:mb-12">
          Why Choose ARA Travels?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Security Feature */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-slide-up">
            <div className="text-primary-600 text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Advanced Security</h3>
            <p className="text-gray-600">
              Two-factor authentication and email verification ensure your account and bookings are always secure.
            </p>
          </div>

          {/* Booking Feature */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-primary-600 text-4xl mb-4">✈️</div>
            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
            <p className="text-gray-600">
              Simple and intuitive booking process with real-time flight updates and instant confirmations.
            </p>
          </div>

          {/* Support Feature */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-primary-600 text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600">
              Our dedicated support team is always ready to assist you with any queries or concerns.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 text-center">
        <div className="bg-primary-100 rounded-lg p-6 sm:p-8 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-800 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-gray-600 mb-6">
            Create an account now and experience secure, hassle-free flight bookings.
          </p>
          <Link 
            to="/signup" 
            className="btn-primary inline-block w-full sm:w-auto"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Landing; 