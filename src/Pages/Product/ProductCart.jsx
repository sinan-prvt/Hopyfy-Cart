// ProductCart.jsx
import { useNavigate } from "react-router-dom";
import { Heart, HeartOff } from "lucide-react";
import { useAuth } from "../../Contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const ProductCart = ({ product }) => {
  const navigate = useNavigate();
  const { user, addToWishlist, removeFromWishlist } = useAuth();
  const isInWishlist = user?.wishlist?.some((item) => item.id === product.id);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/reviews?productId=${product.id}`
        );
        
        if (res.data && res.data.length > 0) {
          const validReviews = res.data.filter(review => typeof review.rating === 'number');
          if (validReviews.length > 0) {
            const total = validReviews.reduce((sum, r) => sum + r.rating, 0);
            const avg = total / validReviews.length;
            setAverageRating(avg);
            setReviewCount(validReviews.length);
            return;
          }
        }
        setAverageRating(0);
        setReviewCount(0);
      } catch (err) {
        console.error("Failed to fetch rating", err);
        setAverageRating(0);
        setReviewCount(0);
      }
    };
    
    if (product.id) {
      fetchRating();
    }
  }, [product.id]);

  // Convert rating to display value
  const displayRating = averageRating > 0 ? averageRating.toFixed(1) : "0.0";
  
  // Render stars based on rating
  const renderStars = () => {
    return [...Array(5)].map((_, i) => {
      let starClass = "text-gray-300"; // Default to empty star
      
      if (averageRating >= i + 1) {
        starClass = "text-yellow-400"; // Full star
      } else if (averageRating > i) {
        starClass = "text-yellow-400"; // Half star (we'll use full for simplicity)
      }
      
      return (
        <span key={i} className={starClass}>
          {averageRating > i && averageRating < i + 1 ? "★" : "★"}
        </span>
      );
    });
  };
  
  return (
    <div
      className="w-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer relative"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative">
        <img
          src={product.image?.[0] || "https://via.placeholder.com/300"}
          alt={product.name || "Product"}
          className="w-full h-56 object-contain p-4 bg-gray-50"
        />
        <button
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
          onClick={handleWishlistToggle}
        >
          {isInWishlist ? (
            <HeartOff className="text-red-500" size={20} />
          ) : (
            <Heart className="text-gray-400 hover:text-red-500" size={20} />
          )}
        </button>
      </div>

      <div className="p-4">
        <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full mb-2">
          {product.category || "Uncategorized"}
        </span>
        <p className="text-sm font-semibold mb-2 text-gray-500">{product.brand || "No Brand"}</p>
        <h3 className="text-md font-semibold mb-1 line-clamp-2 h-12">
          {product.name || "Product Name"}
        </h3>
        <p className="text-green-600 font-bold text-lg">₹{product.price || "0"}</p>
        
        <div className="flex items-center mt-2">
          <div className="flex">
            {renderStars()}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({displayRating} {reviewCount > 0 ? `• ${reviewCount} reviews` : ''})
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCart;