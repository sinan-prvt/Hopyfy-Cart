import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthContext";
import ReviewForm from "../../Components/ReviewForm";
import { Heart, HeartOff, ShoppingCart, Star, ChevronLeft, ChevronRight } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMessage, setShowMessage] = useState({ type: "", text: "" });
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const { user, setUser } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const res = await axios.get(`http://localhost:3000/products/${id}`);
        setProduct(res.data);
        setProductError(null);
      } catch (err) {
        setProductError("Product not found");
        console.error("Product fetch error:", err);
      } finally {
        setLoadingProduct(false);
      }
    };
    
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const res = await axios.get(`http://localhost:3000/reviews?productId=${id}`);
        const fetchedReviews = res.data || [];
        setReviews(fetchedReviews);
        
        if (fetchedReviews.length > 0) {
          const sum = fetchedReviews.reduce((acc, review) => acc + (review.rating || 0), 0);
          const avg = sum / fetchedReviews.length;
          setAverageRating(avg.toFixed(1));
        } else {
          setAverageRating(0);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]);
        setAverageRating(0);
      } finally {
        setLoadingReviews(false);
      }
    };
    
    fetchProduct();
    fetchReviews();
  }, [id]);

  const isInWishlist = user?.wishlist?.some(item => item.id === product?.id);

  const handleAddToCart = async () => {
    if (!user) {
      setShowMessage({ type: "error", text: "Please log in first!" });
      setTimeout(() => setShowMessage({ type: "", text: "" }), 3000);
      return;
    }

    if (product.sizes?.length > 0 && !selectedSize) {
      setSizeError(true);
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
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [
          ...user.cart,
          {
            productId: product.id,
            quantity: quantity,
            size: product.sizes?.length > 0 ? selectedSize : null
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

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeError(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.image.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.image.length - 1 : prev - 1
    );
  };

  const toggleReviews = () => {
    setShowAllReviews(!showAllReviews);
  };

  const handleReviewSubmit = async (newReview) => {
    try {
      const reviewToAdd = {
        ...newReview,
        id: Date.now().toString(),
        username: user.name || "Anonymous",
        date: new Date().toLocaleDateString()
      };
      
      const updatedReviews = [reviewToAdd, ...(reviews || [])];
      setReviews(updatedReviews);
      
      if (updatedReviews.length > 0) {
        const sum = updatedReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
        const newAvg = sum / updatedReviews.length;
        setAverageRating(newAvg.toFixed(1));
      } else {
        setAverageRating(0);
      }
      
      setShowMessage({ type: "success", text: "Review submitted successfully!" });
      setTimeout(() => setShowMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setShowMessage({ type: "error", text: "Failed to submit review" });
      setTimeout(() => setShowMessage({ type: "", text: "" }), 3000);
    }
  };

  if (loadingProduct) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (productError) {
    return <div className="text-center py-20 text-red-600 text-xl">{productError}</div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-gray-600 text-xl">No product found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {showMessage.text && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg transition-all ${
            showMessage.type === "error" 
              ? "bg-red-100 text-red-700 border border-red-300" 
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {showMessage.text}
        </div>
      )}

      <div className="text-sm text-gray-500 mb-6">
        Home / {product.category} / {product.brand} / <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 ">
        <div className="lg:w-1/2 ">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
            <div className="relative group">
              <img
                src={product.image?.[currentImageIndex] || "/default.jpg"}
                alt={product.name}
                className="w-full h-[500px] object-contain bg-gray-50 p-8"
              />
              
              <button
                onClick={handleWishlistToggle}
                className={`absolute top-4 right-4 rounded-full p-3 shadow-lg transition-all ${
                  isInWishlist
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {isInWishlist ? (
                  <HeartOff className="fill-current" size={24} />
                ) : (
                  <Heart className="fill-current" size={24} />
                )}
              </button>
              
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={28} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={28} />
              </button>
              
              {product.image?.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {product.image.length}
                </div>
              )}
            </div>

            {product.image?.length > 1 && (
              <div className="grid grid-cols-6 gap-3 p-4 border-t">
                {product.image.map((img, idx) => (
                  <div
                    key={idx}
                    className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                      idx === currentImageIndex
                        ? "border-blue-500 scale-105"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <img 
                      src={img} 
                      alt={`Preview ${idx + 1}`} 
                      className="w-full h-20 object-cover" 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mb-3">
                  {product.brand}
                </p>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-500">{product.category}</p>
              </div>
              
              <div className="bg-blue-50 px-3 py-1 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">
                  In Stock
                </p>
              </div>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">
                    {i < Math.floor(averageRating) ? "★" : "☆"}
                  </span>
                ))}
                <span className="ml-2 text-lg font-semibold text-gray-800">
                  {averageRating}
                </span>
              </div>
              <span className="mx-3 text-gray-300">|</span>
              <span className="text-gray-600">{reviews.length} reviews</span>
            </div>

            <div className="mb-8">
              <div className="flex items-end gap-2 mb-1">
                <p className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                {product.originalPrice && (
                  <p className="text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</p>
                )}
                {product.discountPercentage && (
                  <p className="text-green-600 font-medium">{product.discountPercentage}% off</p>
                )}
              </div>
              <p className="text-sm text-gray-500">Inclusive of all taxes</p>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-3 text-lg">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || "No description available."}
              </p>
            </div>

            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800 text-lg">Select Size</h3>
                  {selectedSize && (
                    <span className="text-sm text-gray-500">
                      Selected: <span className="font-medium text-gray-800">{selectedSize}</span>
                    </span>
                  )}
                </div>
                
                {sizeError && (
                  <p className="text-red-500 text-sm mb-3">
                    Please select a size before adding to cart
                  </p>
                )}
                
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`py-3 border-2 rounded-lg transition-all ${
                        selectedSize === size
                          ? "border-blue-500 bg-blue-50 text-blue-600 font-medium shadow-sm"
                          : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                      } ${sizeError ? "border-red-500" : ""}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  -
                </button>
                <span className="px-4 py-3 w-12 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  (product.sizes?.length > 0 && !selectedSize) 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                }`}
                disabled={product.sizes?.length > 0 && !selectedSize}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              
              <button 
                onClick={handleWishlistToggle}
                className={`p-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                  isInWishlist
                    ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {isInWishlist ? <HeartOff size={24} /> : <Heart size={24} />}
              </button>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-5 text-gray-800">Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex">
                  <p className="text-gray-600 w-32">Brand</p>
                  <p className="font-medium text-gray-900">{product.brand}</p>
                </div>
                <div className="flex">
                  <p className="text-gray-600 w-32">Category</p>
                  <p className="font-medium text-gray-900">{product.category}</p>
                </div>
                {product.shoeType && (
                  <div className="flex">
                    <p className="text-gray-600 w-32">Shoe Type</p>
                    <p className="font-medium text-gray-900">{product.shoeType}</p>
                  </div>
                )}
                {product.color && (
                  <div className="flex">
                    <p className="text-gray-600 w-32">Color</p>
                    <p className="font-medium text-gray-900">{product.color}</p>
                  </div>
                )}
                {product.material && (
                  <div className="flex">
                    <p className="text-gray-600 w-32">Material</p>
                    <p className="font-medium text-gray-900">{product.material}</p>
                  </div>
                )}
                {product.weight && (
                  <div className="flex">
                    <p className="text-gray-600 w-32">Weight</p>
                    <p className="font-medium text-gray-900">{product.weight}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-semibold text-2xl text-gray-900">Customer Reviews</h3>
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
                <Star className="text-yellow-400 fill-current" size={20} />
                <span className="ml-2 font-semibold text-gray-900">{averageRating} out of 5</span>
              </div>
            </div>
            
            {loadingReviews ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p>Loading reviews...</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h4 className="font-medium text-lg mb-4">Overall Rating</h4>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <button key={i} className="mr-1 focus:outline-none">
                        <Star className={`${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} size={24} />
                      </button>
                    ))}
                    <span className="ml-2 text-gray-600">Based on {reviews.length} reviews</span>
                  </div>
                </div>
                
                <div className="border-t pt-8">
                  <h3 className="font-semibold text-xl mb-6">Add Your Review</h3>
                  {user ? (
                    <ReviewForm 
                      productId={product.id} 
                      productCategory={product.category}
                      onReviewSubmit={handleReviewSubmit}
                    />
                  ) : (
                    <div className="bg-blue-50 rounded-xl p-6 text-center">
                      <p className="text-blue-800 mb-3">
                        Please sign in to write a review
                      </p>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Sign In
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6 mb-15">
                  <h2 className="text-xl font-semibold mb-4">Overall Reviews</h2>
                  
                  {reviews.length > 0 ? (
                    <>
                      {(showAllReviews ? reviews : reviews.slice(0, 3)).map(review => (
                        <div 
                          key={review.id} 
                          className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow bg-white"
                        >
                          <div className="flex items-center mb-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-yellow-400">
                                  {i < review.rating ? "★" : "☆"}
                                </span>
                              ))}
                            </div>
                            <span className="ml-3 font-medium text-gray-900">{review.username}</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-gray-500 text-sm">{review.date}</span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                      
                      {reviews.length > 3 && (
                        <div className="text-center mt-6">
                          <button
                            onClick={toggleReviews}
                            className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-full transition-colors"
                          >
                            {showAllReviews 
                              ? `Show Less (${reviews.length - 3} less)` 
                              : `Show More (${reviews.length - 3} more)`}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No reviews yet. Be the first to review!
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;