  import { useAuth } from "../Contexts/AuthContext";
  import { Link, useNavigate } from "react-router-dom";
  import { Heart, ShoppingCart } from "lucide-react";
  import { motion } from "framer-motion";

  const Navbar = () => {
    const { user, logout } = useAuth(); 
    const navigate = useNavigate();

    const wishlistCount = user?.wishlist?.length || 0;
    const cartCount = user?.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    const handleLogout = () => {
      logout();
      navigate("/login");
    };

    // Logo animation variants
    const logoVariants = {
      hover: {
        scale: 1.05,
        transition: { duration: 0.3 }
      },
      tap: {
        scale: 0.95
      }
    };

    // Icon animation variants
    const iconVariants = {
      hover: {
        scale: 1.2,
        transition: { duration: 0.2 }
      },
      tap: {
        scale: 0.9
      }
    };

    return (
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        {/* Animated Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
        
          <motion.h1 
            className="text-2xl font-extrabold text-white"
            variants={logoVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <img src={"./logo.png"}className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100 w-20">
              
            </img>
          </motion.h1>
        </motion.div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6">
          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/" 
              className="text-white hover:text-yellow-200 font-medium transition-colors duration-200"
            >
              Home
            </Link>
          </motion.li>
          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/product" 
              className="text-white hover:text-yellow-200 font-medium transition-colors duration-200"
            >
              Products
            </Link>
          </motion.li>
          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/my-orders" 
              className="text-white hover:text-yellow-200 font-medium transition-colors duration-200"
            >
              My Orders
            </Link>
          </motion.li>
          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/about" 
              className="text-white hover:text-yellow-200 font-medium transition-colors duration-200"
            >
              About
            </Link>
          </motion.li>
        </ul>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Wishlist */}
          <motion.div 
            variants={iconVariants}
            whileHover="hover"
            whileTap="tap"
            className="relative"
          >
            <Link to="/wishlist">
              <Heart className="text-white hover:text-red-300 transition-colors duration-200" size={24} />
              {wishlistCount > 0 && (
                <motion.span 
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>
          </motion.div>

          {/* Cart */}
          <motion.div 
            variants={iconVariants}
            whileHover="hover"
            whileTap="tap"
            className="relative"
          >
            <Link to="/cart">
              <ShoppingCart className="text-white hover:text-blue-200 transition-colors duration-200" size={24} />
              {cartCount > 0 && (
                <motion.span 
                  className="absolute -top-2 -right-2 bg-yellow-400 text-gray-800 text-xs px-1.5 py-0.5 rounded-full font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>
          </motion.div>

          {/* User Section */}
          {user ? (
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="hidden sm:inline text-white font-medium">Welcome, {user.name}</span>
              <motion.button 
                onClick={handleLogout}
                className="bg-white text-blue-600 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200 shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </motion.div>
          ) : (
            <div className="flex space-x-3">
              <motion.button 
                onClick={() => navigate("/login")}
                className="text-white hover:text-yellow-200 font-medium px-3 py-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
              <motion.button 
                onClick={() => navigate("/signup")}
                className="bg-yellow-400 text-blue-800 px-4 py-2 rounded-full font-bold hover:bg-yellow-300 transition-colors duration-200 shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </div>
          )}
        </div>      
      </nav>
    );
  };

  export default Navbar;