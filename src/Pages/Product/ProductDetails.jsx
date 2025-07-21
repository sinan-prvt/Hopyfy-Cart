import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthContext";
import ReviewForm from "../../Components/ReviewForm";
import { Heart, HeartOff, ShoppingCart, Star } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMessage, setShowMessage] = useState({ type: "", text: "" });
  const [selectedSize, setSelectedSize] = useState(null);

  const { user, setUser } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const res = await axios.get(`http://localhost:3000/products/${id}`);
        setProduct(res.data);
        setProductError(null);

        if (res.data.sizes && res.data.sizes.length > 0) {
          setSelectedSize(res.data.sizes[0]);
        }
      } catch (err) {
        setProductError("Product not found");
        console.error("Product fetch error:", err);
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [id]);

  const isInWishlist = user?.wishlist?.some(item => item.id === product?.id);

  const handleAddToCart = async () => {
    if (!user) {
      setShowMessage({ type: "error", text: "Please log in first!" });
      setTimeout(() => setShowMessage({ type: "", text: "" }), 3000);
      return;
    }

    if (product.category === "Shoes" && !selectedSize) {
      setShowMessage({ type: "error", text: "Please select a size first!" });
      setTimeout(() => setShowMessage({ type: "", text: "" }), 3000);
      return;
    }

    const existing = user.cart.find(
      item => item.productId === product.id && item.size === selectedSize
    );

    const updatedCart = existing
      ? user.cart.map(item =>
          item.productId === product.id && item.size === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [
          ...user.cart,
          {
            productId: product.id,
            quantity: 1,
            size: product.category === "Shoes" ? selectedSize : null
          }
        ];

    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        cart: updatedCart
      });
      setUser({ ...user, cart: updatedCart });

      setShowMessage({ type: "success", text: "Added to cart!" });
      setTimeout(() => setShowMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setShowMessage({ type: "error", text: "Failed to add to cart" });
      setTimeout(() => setShowMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      setShowMessage({ type: "error", text: "Please log in first!" });
      setTimeout(() => setShowMessage({ type: "", text: "" }), 3000);
      return;
    }

    const isWishlisted = user.wishlist?.some(item => item.id === product.id);
    const updatedWishlist = isWishlisted
      ? user.wishlist.filter(item => item.id !== product.id)
      : [...(user.wishlist || []), product];

    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        wishlist: updatedWishlist
      });
      setUser({ ...user, wishlist: updatedWishlist });
      setShowMessage({
        type: "success",
        text: isWishlisted ? "Removed from wishlist" : "Added to wishlist"
      });
      setTimeout(() => setShowMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("Wishlist error:", err);
      setShowMessage({ type: "error", text: "Wishlist update failed" });
      setTimeout(() => setShowMessage({ type: "", text: "" }), 3000);
    }
  };

  if (loadingProduct) {
    return <div className="text-center py-10 text-gray-600">Loading product details...</div>;
  }

  if (productError) {
    return <div className="text-center py-10 text-red-600">{productError}</div>;
  }

  if (!product) {
    return <div className="text-center py-10 text-gray-600">No product found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {showMessage.text && (
        <div
          className={`text-center mb-4 px-4 py-2 rounded-md ${
            showMessage.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {showMessage.text}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-4">
            <div className="relative">
              <img
                src={product.image?.[currentImageIndex] || "/default.jpg"}
                alt={product.name}
                className="w-full h-96 object-contain bg-gray-50"
              />
              <button
                onClick={handleWishlistToggle}
                className={`absolute top-3 right-3 rounded-full p-2 shadow-md ${
                  isInWishlist
                    ? "bg-red-100 text-red-500 hover:bg-red-200"
                    : "bg-white text-gray-500 hover:bg-gray-100"
                }`}
              >
                {isInWishlist ? (
                  <HeartOff className="fill-current" size={24} />
                ) : (
                  <Heart className="fill-current" size={24} />
                )}
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2 p-4 border-t">
              {product.image?.map((img, idx) => (
                <div
                  key={idx}
                  className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                    idx === currentImageIndex
                      ? "border-blue-500 scale-105"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-20 object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm font-semibold mb-2 text-gray-500">{product.brand}</p>
            <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-500 mb-4">{product.category}</p>

            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">
                    {i < Math.floor(averageRating) ? "★" : "☆"}
                  </span>
                ))}
                <span className="ml-2 text-lg font-semibold">
                  {averageRating}
                </span>
              </div>
              <span className="text-gray-500">|</span>
              <span className="ml-4 text-gray-600">{reviews.length} reviews</span>
            </div>

            <p className="text-xl font-bold text-green-600 mb-4">₹{product.price}</p>

            {/* Product Description */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">About Product</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Size Selector for Shoes */}
            {product.category === "Shoes" && product.sizes?.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-700">Select Size</h3>
                  {selectedSize && (
                    <span className="text-sm text-gray-500">
                      Selected: <span className="font-medium">{selectedSize}</span>
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md transition-colors ${
                        selectedSize === size
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              
              <button 
                onClick={handleWishlistToggle}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  isInWishlist
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {isInWishlist ? <HeartOff size={20} /> : <Heart size={20} />}
                {isInWishlist ? "Remove Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">Product Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Brand</p>
                  <p className="font-medium">{product.brand}</p>
                </div>
                <div>
                  <p className="text-gray-600">Category</p>
                  <p className="font-medium">{product.category}</p>
                </div>

                {product.category === "Shoes" && (
                  <div className="col-span-2">
                    <p className="text-gray-600">Available Sizes</p>
                    <p className="font-medium">{product.sizes.join(", ")}</p>
                  </div>
                )}
                
                {product.category === "Shoes" && (
                  <div className="col-span-2">
                    <p className="text-gray-600">Shoe Type</p>
                    <p className="font-medium">{product.shoeType || "Casual"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
      
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4">Add Your Review</h3>
              {user ? (
                <ReviewForm 
                  productId={product.id} 
                  productCategory={product.category}
                  onReviewSubmit={(newReview) => {
                    setReviews([...reviews, newReview]);
                    
                    // Update average rating
                    const newAvg = [...reviews, newReview].reduce(
                      (sum, r) => sum + r.rating, 0) / (reviews.length + 1);
                    setAverageRating(newAvg.toFixed(1));
                    
                    setShowMessage({ type: "success", text: "Review submitted!" });
                    setTimeout(() => setShowMessage({ type: "", text: "" }), 3000);
                  }} 
                />
              ) : (
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-blue-800">
                    Please <a href="/login" className="font-semibold underline">sign in</a> to write a review
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProductDetails;