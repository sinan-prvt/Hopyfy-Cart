import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FiCheck, FiArrowLeft, FiMail } from 'react-icons/fi';

const SubscribePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialEmail = queryParams.get('email') || '';
  
  const [email, setEmail] = useState(initialEmail);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      // Here you would typically send the email to your backend
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center"
        >
          <Link 
            to="/" 
            className="flex items-center justify-center text-indigo-600 hover:text-indigo-800 transition-colors mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Back to Home
          </Link>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-extrabold text-gray-900"
          >
            {isSubscribed ? 'Subscription Confirmed!' : 'Join Our Newsletter'}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-sm text-gray-600"
          >
            {isSubscribed 
              ? 'You are now part of our community. Exciting updates coming your way!'
              : 'Get the latest news and updates delivered to your inbox.'}
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10"
        >
          {!isSubscribed ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-3 pl-10 block w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subscribing...
                    </>
                  ) : 'Subscribe Now'}
                </button>
              </motion.div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-6"
            >
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <FiCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome Aboard!
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                We've sent a confirmation email to <span className="font-medium">{email}</span>.
              </p>
              <div className="text-sm">
                <p className="text-gray-500">
                  Didn't receive anything?{' '}
                  <button 
                    onClick={() => setIsSubscribed(false)}
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Try again
                  </button>
                  {' '}or check your spam folder.
                </p>
              </div>
            </motion.div>
          )}

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  What to expect
                </span>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              <ul className="space-y-2">
                <li>• Weekly curated content</li>
                <li>• Exclusive offers and discounts</li>
                <li>• No spam, unsubscribe anytime</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SubscribePage;