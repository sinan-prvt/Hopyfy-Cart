import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useAuth } from "../../Contexts/AuthContext";
import Toast from "../../Components/Toast"; // Make sure to create this component

const ProductCart = ({ product }) => {
  const { user, addToCart, addToWishlist } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  
  const getImageUrl = (image) => {
    if (!image) return null;
    
    if (Array.isArray(image)) {
      if (image.length === 0) return null;
      const firstImage = image[0];
      
      if (typeof firstImage === 'object' && firstImage.url) {
        return firstImage.url;
      }
      return firstImage;
    }
    
    if (typeof image === 'object' && image.url) {
      return image.url;
    }
    
    if (typeof image === 'string') {
      return image;
    }
    
    return null;
  };

  // Check if product is in wishlist
  useEffect(() => {
    if (user && user.wishlist) {
      const inWishlist = user.wishlist.some(item => item.id === product.id);
      setIsWishlisted(inWishlist);
    }
  }, [user, product.id]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (addToCart) {
      addToCart(product);
      showToast("Added to cart!", "success");
    } else {
      showToast("Failed to add to cart", "error");
      console.error("addToCart function is not implemented in AuthContext");
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (addToWishlist) {
      const newWishlistStatus = !isWishlisted;
      addToWishlist(product);
      setIsWishlisted(newWishlistStatus);
      
      showToast(
        newWishlistStatus ? "Added to wishlist!" : "Removed from wishlist",
        "success"
      );
    } else {
      showToast("Failed to update wishlist", "error");
      console.error("addToWishlist function is not implemented in AuthContext");
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const imageUrl = getImageUrl(product.image);

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col relative"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Toast notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ show: false, message: "", type: "" })} 
        />
      )}

      {/* Wishlist button */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart 
          size={18} 
          className={isWishlisted ? "text-red-500 fill-current" : "text-gray-500"} 
        />
      </button>

      <Link to={`/product/${product.id}`} className="flex-grow">
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {imageUrl ? (
            <motion.img
              src={imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover"
              animate={{ 
                scale: isHovered ? 1.05 : 1,
                transition: { duration: 0.3 } 
              }}
              onError={(e) => {
                e.target.classList.add('hidden');
                e.target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div 
            className={`bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 ${imageUrl ? 'hidden' : ''}`}
          />
          
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-bold text-sm bg-red-500 px-2 py-1 rounded">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="w-4/5">
            <Link to={`/product/${product.id}`}>
              <h3 className="font-semibold text-gray-800 hover:text-blue-600 line-clamp-2 text-sm mb-1">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 truncate">{product.brand}</p>
          </div>
          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-1.5 py-1 rounded text-xs">
            <Star size={12} fill="currentColor" />
            <span>{product.rating || 4.5}</span>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-base font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-xs text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </p>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs ${
                product.stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <ShoppingCart size={14} />
              <span>Add</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCart;