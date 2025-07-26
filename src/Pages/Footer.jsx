import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div className="space-y-5">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Hopyfy Cart</h2>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Your go-to shop for trending products and best prices. We deliver happiness right to your doorstep with fast shipping and excellent customer service.
          </p>
          <div className="flex space-x-4 pt-2">
            {[0, 1, 2, 3].map((item) => (
              <a key={item} href="#" className="bg-gray-800 hover:bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-5 pb-2 border-b border-gray-700 inline-block">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                Home
              </Link>
            </li>
            <li>
              <Link to="/product" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                Products
              </Link>
            </li>
            <li>
              <Link to="/about" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-bold mb-5 pb-2 border-b border-gray-700 inline-block">Support</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/faq" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link to="/returns" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                Returns & Exchanges
              </Link>
            </li>
            <li>
              <Link to="/privacypolicy" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Newsletter */}
        <div>
          <h3 className="text-lg font-bold mb-5 pb-2 border-b border-gray-700 inline-block">Stay Updated</h3>
          <div className="space-y-5">
            <div>
              <p className="flex items-center text-sm text-gray-300 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                hopyfycart@gmail.com
              </p>
              <p className="flex items-center text-sm text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91-9400850450
              </p>
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-gray-300 mb-3">Subscribe to our newsletter for the latest updates and offers</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-700 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
                />
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-r-lg text-sm font-medium transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Hopyfy Cart. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;