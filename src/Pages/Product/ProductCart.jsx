import { useNavigate } from "react-router-dom";
import { Heart, HeartOff } from "lucide-react";
import { useAuth } from "../../Contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";


const ProductCart = ({ product }) => {
  
  const navigate = useNavigate();
  const { user, addToWishlist, removeFromWishlist } = useAuth();
  const isInWishlist = user?.wishlist?.some((item) => item.id === product.id);

  const handleWishlistToggle = (e) => {
    e.stopPropagation()
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const [averageRating, setAverageRating] = useState(0);

useEffect(() => {
  const fetchRating = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/reviews?productId=${product.id}`);
      const avg =
        res.data.length > 0
          ? res.data.reduce((sum, r) => sum + r.rating, 0) / res.data.length
          : 0;
      setAverageRating(avg.toFixed(1));
    } catch (err) {
      console.error("Failed to fetch rating");
    }
  };

  fetchRating();
}, [product.id]);


  return (
    <>
       <div
      className=" min-w-[250px] max-w-[150px] p-2 border rounded flex-shrink-0 cursor-pointer relative "
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <img
        src={product.image[0]}
        alt={product.name}
        className="w-full h-[220px] object-contain mb-2 "
      />
      <h3 className="text-sm font-semibold leading-tight line-clamp-3">
        {product.name}
      </h3>
      <p className="text-green-600 text-xs font-medium mt-1">
        From ₹{product.price}
      </p>

      {/* Wishlist Button */}
      <button
        className="absolute top-2 right-2 text-red-500 z-10"
        onClick={handleWishlistToggle}
      >
        {isInWishlist ? <HeartOff /> : <Heart />}
      </button>

      <div className="flex items-center space-x-1 mt-2">
  {[...Array(5)].map((_, i) => (
    <span key={i}>
      {i < Math.round(averageRating) ? "⭐" : "☆"}
    </span>
  ))}
  <span className="text-sm text-gray-600">({averageRating})</span>
</div>

    </div>

    
    </>
  );
};

export default ProductCart;
