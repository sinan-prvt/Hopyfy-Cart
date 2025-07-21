import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthContext";
import { Link } from "react-router-dom";

const Cart = () => {

  const { user, setUser } = useAuth();
  const [cartDetails, setCartDetails] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchCartDetails = async () => {                   //fetch cart details
    try {
      const res = await axios.get("http://localhost:3000/products");
      const allProducts = res.data;

      const details = user?.cart                       //match user cart items with product details
        ?.map((item) => {
          const product = allProducts.find(
            (p) => p?.id?.toString() === item?.productId?.toString()
          );
          if (!product) return null;
          return {
            ...product,
            quantity: item.quantity,
          };
        })
        .filter((item) => item !== null);

      setCartDetails(details);
      calculateTotal(details);
    } catch (err) {
      console.error("Error fetching cart data:", err);
    }
  };

  const calculateTotal = (cart) => {                 //calculate total price
    const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const handleRemove = async (productId) => {        //remove items from cart
    try {
      const updatedCart = user.cart.filter(
        (item) => item.productId.toString() !== productId.toString()
      );

      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        cart: updatedCart,
      });

      setUser((prevUser) => ({
        ...prevUser,
        cart: updatedCart,
      }));

      const updatedDetails = cartDetails.filter(              
        (item) => item.id.toString() !== productId.toString()
      );
      setCartDetails(updatedDetails);
      calculateTotal(updatedDetails);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {         //update item quantity
    if (newQuantity < 1) return;

    try {
      const updatedCart = user.cart.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );

      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        cart: updatedCart,
      });

      setUser((prevUser) => ({
        ...prevUser,
        cart: updatedCart,
      }));

      const updatedDetails = cartDetails.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );

      setCartDetails(updatedDetails);
      calculateTotal(updatedDetails);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  useEffect(() => {                                //load cart data
    if (user && user.cart?.length > 0) {
      fetchCartDetails();
    } else {
      setCartDetails([]);
      setTotal(0);
    }
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartDetails.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid gap-4">
          {cartDetails.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image?.[0]}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p>₹{item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 bg-gray-200 rounded" disabled={item.quantity <= 1} >
                      −
                    </button>

                    <span className="text-lg">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 bg-gray-200 rounded" >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button type="button" onClick={() => handleRemove(item.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 self-start sm:self-auto">
                Remove
              </button>
            </div>
          ))}
          <div className="text-right mt-4 font-semibold text-lg">
            Total: ₹{total.toFixed(2)}
          </div>

          <Link to="/checkout">
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
