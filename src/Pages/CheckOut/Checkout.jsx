import { useState, useEffect } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import axios from "axios";

const Checkout = () => {
  const { user, setUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {                             //product details fetch for cart
    const fetchCartDetails = async () => {
      if (user?.cart?.length > 0) {
        try {
          const { data: allProducts } = await axios.get("http://localhost:3000/products");

          const detailedCart = user.cart.map((cartItem) => {
            const product = allProducts.find((p) => p.id === cartItem.productId);
            if (!product) return null;

            const quantity = Math.max(Number(cartItem.quantity) || 1, 1);
            const price = Number(product.price) || 0;

            return {
              ...product,
              quantity,
              subtotal: price * quantity,
            };
          }).filter(Boolean);

          setCartItems(detailedCart);

          const total = detailedCart.reduce((sum, item) => sum + item.subtotal, 0);
          setTotalAmount(total);
        } catch (error) {
          console.error("Error fetching cart products:", error);
        }
      }
    };
    fetchCartDetails();
  }, [user]);


  const handlePlaceOrder = async () => {                      //save order and clear cart
    if (!user || cartItems.length === 0) return;

    const orderData = {
      userId: user.id,
      items: cartItems.map(({ id, name, price, quantity }) => ({
        productId: id,
        name,
        price,
        quantity,
      })),
      totalAmount,
      orderDate: new Date().toISOString(),
      status: "pending",
    };

    try {
      await axios.post("http://localhost:3000/order", orderData);
      await axios.patch(`http://localhost:3000/users/${user.id}`, { cart: [] });

      setUser((prev) => ({ ...prev, cart: [] }));

      alert("Order placed successfully!");
      window.location.href = "/orders";
    } catch (err) {
      console.error("Order placement failed:", err);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between border-b py-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <div>
                ₹{item.price} × {item.quantity} = ₹{item.subtotal}
              </div>
            </div>
          ))}

          <div className="text-right font-bold text-lg mt-4">
            Total: ₹{totalAmount}
          </div>

          <button className="mt-6 bg-black text-white py-2 px-4 rounded hover:bg-gray-800" onClick={handlePlaceOrder} >
            Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;
