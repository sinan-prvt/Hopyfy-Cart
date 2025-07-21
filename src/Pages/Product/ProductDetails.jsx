import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthContext";
import ReviewForm from "../../Components/ReviewForm";

const ProductDetail = () => {

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const { user, setUser } = useAuth();

  useEffect(() => {                             //product fetch
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
    fetchProduct();
  }, [id]);

  const fetchReviews = async () => {                             //review fetch
    try {
      setLoadingReviews(true);
      const res = await axios.get(`http://localhost:3000/review?productId=${id}`);
      const fiveStarReviews = res.data.filter((r) => r.rating === 5);
      setReviews(fiveStarReviews);

      const avg =
        fiveStarReviews.length > 0
          ? fiveStarReviews.reduce((sum, r) => sum + r.rating, 0) / fiveStarReviews.length
          : 0;
      setAverageRating(avg.toFixed(1));
    } catch (err) {
      console.error("Error fetching reviews", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (product) fetchReviews();
  }, [product]);


  const handleAddToCart = async () => {                           //Add to cart
    if (!user) return alert("Please log in first!");

    const existing = user.cart.find((item) => item.productId === product.id);
    const updatedCart = existing
      ? user.cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...user.cart, { productId: product.id, quantity: 1 }];

    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        cart: updatedCart,
      });
      setUser({ ...user, cart: updatedCart });
      alert("Added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleAddToWishlist = async () => {                //Add to wishlist
    if (!user) return alert("Please log in first!");

    const alreadyWishlisted = user.wishlist.find(
      (item) => item.productId === product.id
    );
    if (alreadyWishlisted) return alert("Already in Wishlist");

    const updatedWishlist = [...user.wishlist, { productId: product.id }];

    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        wishlist: updatedWishlist,
      });
      setUser({ ...user, wishlist: updatedWishlist });
      alert("Added to Wishlist");
    } catch (error) {
      console.error("Failed to update wishlist", error);
    }
  };

  if (loadingProduct) return <div className="p-8">Loading product...</div>;
  if (productError) return <div className="p-8 text-red-600">{productError}</div>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.image?.[0] || "/default.jpg"}
          alt={product.name}
          className="w-full md:w-1/2 rounded-xl shadow"
        />
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-lg text-gray-600">{product.description}</p>
          <p className="text-xl font-semibold">₹{product.price}</p>
          <br />
          <br />

          <button onClick={handleAddToCart} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl" >
            Add to Cart
          </button>

          <button onClick={handleAddToWishlist} className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded mt-4" >
            Add to Wishlist
          </button>
        </div>
      </div>

      <div className="mt-10 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">
          Average Rating (only 5⭐): ⭐ {averageRating}
        </h2>

        <ul className="space-y-2">
          {reviews.map((r) => (
            <li key={r.id} className="border p-3 rounded">
              <p className="font-medium">⭐ {r.rating} / 5</p>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Rate This Product:</h3>
          {user ? (
            <ReviewForm productId={product.id} onReviewSubmit={fetchReviews} />
          ) : (
            <p className="text-gray-600">Please log in to rate.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
