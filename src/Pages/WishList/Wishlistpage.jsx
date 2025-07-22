import { useAuth } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const WishlistPage = () => {
  const { user, removeFromWishlist, moveToCart } = useAuth();
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isMovingToCart, setIsMovingToCart] = useState(false);
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);

  useEffect(() => {
    if (!user?.wishlist?.length) {
      const timer = setTimeout(() => setShowEmptyMessage(true), 500);
      return () => clearTimeout(timer);
    }
  }, [user?.wishlist]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center p-8 max-w-md"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Please sign in to view your wishlist
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  const handleRemove = async (productId) => {
    setIsRemoving(true);
    await removeFromWishlist(productId);
    setIsRemoving(false);
  };

  const handleMoveToCart = async (product) => {
    setIsMovingToCart(true);
    await moveToCart(product);
    setIsMovingToCart(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wishlist</h1>
        <p className="text-gray-600">
          {user.wishlist?.length || 0} item{user.wishlist?.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      <AnimatePresence>
        {user.wishlist?.length === 0 && showEmptyMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="bg-pink-100 p-6 rounded-full mb-6">
              <Heart className="w-12 h-12 text-pink-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6 max-w-md text-center">
              Save your favorite items here to keep track of what you love
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Continue Shopping <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {user.wishlist?.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 relative group"
            >
              <div className="relative">
                <img
                  src={item.images?.[0] || '/placeholder-product.jpg'}
                  alt={item.name}
                  className="w-full h-60 object-cover cursor-pointer"
                  onClick={() => navigate(`/product/${item.id}`)}
                />
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={isRemoving}
                  className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                  <X size={18} />
                </button>
                {item.discountPercentage && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {item.discountPercentage}% OFF
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 
                  className="font-semibold text-lg mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < (item.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({item.reviewCount || 0})</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{item.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleMoveToCart(item)}
                  disabled={isMovingToCart}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isMovingToCart ? (
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      Move to Cart
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {user.wishlist?.length > 0 && (
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 mx-auto"
          >
            Continue Shopping <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;