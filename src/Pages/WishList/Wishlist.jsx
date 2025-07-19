import { useAuth } from "../../Contexts/AuthContext";

const Wishlist = () => {
  const { user, removeFromWishlist, moveToCart } = useAuth();

  if (!user) {
    return <p className="text-center mt-4">Please log in to view your wishlist.</p>;
  }

  const wishlist = user?.wishlist || [];

  if (wishlist.length === 0) {
    return <p className="text-center mt-4">Your wishlist is empty.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {wishlist.map((product) => (
        <div
          key={product.id}
          className="border rounded shadow p-4 relative bg-white"
        >
          {product.image?.[0] ? (
            <img
              src={product.image[0]}
              alt={product.name}
              className="w-full h-40 object-cover rounded"
            />
          ) : (
            <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center">
              No image
            </div>
          )}

          <h3 className="text-lg font-semibold mt-2 line-clamp-2">{product.name}</h3>
          <p className="text-green-600 font-medium mt-1">₹{product.price}</p>

          <button
            className="absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-1 rounded text-sm hover:bg-red-200"
            onClick={() => removeFromWishlist(product.id)}
          >
            Remove
          </button>

          <button
            onClick={() => moveToCart(product.id)}
            className="mt-2 w-full bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Move to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
