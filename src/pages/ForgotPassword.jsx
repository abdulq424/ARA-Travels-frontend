import { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../services/api';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await auth.forgotPassword(email);
      setResetSent(true);
      toast.success('Password reset instructions have been sent to your email');
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || 'Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-primary-800 mb-2">Reset Password</h2>
            <p className="text-gray-600 mb-8">
              {!resetSent 
                ? "Enter your email address and we'll send you instructions to reset your password"
                : "Check your email for password reset instructions"}
            </p>
          </div>

          {!resetSent ? (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-150 ease-in-out"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3 text-base font-medium"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Instructions'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-green-600 mb-4">
                If an account exists with this email, you will receive password reset instructions shortly.
              </p>
              <Link to="/signin" className="btn-primary inline-block px-6 py-2">
                Return to Sign In
              </Link>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/signin" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword; 