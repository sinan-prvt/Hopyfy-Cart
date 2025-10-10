import { useState, useEffect } from 'react';
import { useAuth } from "../Contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, ShoppingCart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const wishlistCount = user?.wishlist?.length || 0;
  const cartCount = user?.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const logoVariants = {
    hover: { scale: 1.05, rotate: -5, transition: { duration: 0.3 } },
    tap: { scale: 0.95 }
  };

  const iconVariants = {
    hover: { scale: 1.2, transition: { duration: 0.2 } },
    tap: { scale: 0.9 }
  };

  const countVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.5, repeat: Infinity, repeatDelay: 3 }
    }
  };

const navBackground = "backdrop-blur-md"; 
const navShadow = isScrolled ? "shadow-md" : "shadow-sm";
const textColor = "text-gray-900";
const hoverColor = "hover:text-blue-600";


  return (
    <>
      <nav
        className={`${navBackground} ${navShadow} py-2 px-4 flex justify-between items-center sticky top-0 z-50 transition-all duration-300`}
      >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <motion.div
          variants={logoVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <img
            src="./logo.png"
            alt="Logo"
            className="w-20"
          />
        </motion.div>
      </motion.div>


        <ul className="hidden md:flex space-x-6">
          {['Home', 'Product', 'My Orders', 'About'].map((item) => {
            const path = item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`;
            return (
              <motion.li 
                key={item}
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to={path} 
                  className={`${textColor} ${hoverColor} font-medium transition-colors duration-200 relative`}
                >
                  {item}
                  {location.pathname === path && (
                    <motion.div 
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                      layoutId="navbar-underline"
                    />
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>

        <div className="flex items-center space-x-4">
          <motion.div 
            variants={iconVariants}
            whileHover="hover"
            whileTap="tap"
            className="relative"
          >
            <Link to="/wishlist" className="flex items-center">
              <Heart className={`${textColor} transition-colors duration-200`} size={24} />
              {wishlistCount > 0 && (
                <motion.span 
                  className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full"
                  variants={countVariants}
                  animate="pulse"
                  initial={false}
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>
          </motion.div>

          <motion.div 
            variants={iconVariants}
            whileHover="hover"
            whileTap="tap"
            className="relative"
          >
            <Link to="/cart" className="flex items-center">
              <ShoppingCart className={`${textColor} transition-colors duration-200`} size={24} />
              {cartCount > 0 && (
                <motion.span 
                  className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold"
                  variants={countVariants}
                  animate="pulse"
                  initial={false}
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>
          </motion.div>

          <motion.button
            className="md:hidden ml-2"
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={`${textColor}`} size={24} />
            ) : (
              <Menu className={`${textColor}`} size={24} />
            )}
          </motion.button>

          {user ? (
            <motion.div 
              className="hidden md:flex items-center space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className={`${textColor} font-medium hidden sm:inline`}>
                Welcome, {user.name}
              </span>
              <motion.button 
                onClick={handleLogout}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-full font-medium shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </motion.div>
          ) : (
            <div className="hidden md:flex space-x-3">
              <motion.button 
                onClick={() => navigate("/login")}
                className="text-gray-800 border border-gray-300 hover:border-blue-600 hover:text-blue-600 px-4 py-0.5 rounded-full font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
              <motion.button 
                onClick={() => navigate("/signup")}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-1 rounded-full font-bold shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </div>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-50 shadow-lg overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {['Home', 'Product', 'My Orders', 'About'].map((item) => {
                const path = item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`;
                return (
                  <motion.div
                    key={item}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link 
                      to={path} 
                      className="block py-2 text-gray-800 font-medium hover:text-blue-600"
                    >
                      {item}
                    </Link>
                  </motion.div>
                );
              })}
              
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-3">
                    <div className="text-gray-800 font-medium">
                      Welcome, {user.name}
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-full font-medium"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <button 
                      onClick={() => navigate("/login")}
                      className="w-full text-gray-800 font-medium px-4 py-2 border border-gray-300 rounded-full hover:border-blue-600 hover:text-blue-600"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => navigate("/signup")}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-700"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
