import { useAuth } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Wishlistpage = () => {
  const { user, removeFromWishlist, moveToCart } = useAuth();
  const navigate = useNavigate();

  if (!user) return <p>Loading...</p>;

  const wishlistItems = user.wishlist || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Your Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wishlistItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow">
              <img
                src={item.images?.[0]}
                alt={item.name}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="text-lg font-semibold mt-2">{item.name}</h2>
              <p className="text-gray-600">₹{item.price}</p>

              <div className="mt-2 flex gap-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => moveToCart(item)} >
                  Move to Cart
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => removeFromWishlist(item.id)} >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlistpage
