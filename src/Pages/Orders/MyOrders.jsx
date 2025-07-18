import { useState, useEffect } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { useOrder } from "../../Contexts/OrderContext";
import axios from "axios";

const MyOrders = () => {
  const { user, setUser } = useAuth();
  const { placeOrder } = useOrder();

  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (user?.cart?.length > 0) {
        try {
          const { data: allProducts } = await axios.get("http://localhost:3000/products");

          const enrichedCart = user.cart.map((cartItem) => {
            const product = allProducts.find((p) => p.id === cartItem.productId);
            return {
              ...cartItem,
              name: product?.name || "Unnamed Item",
              price: Number(product?.price) || 0,
            };
          });

          setCart(enrichedCart);

          const total = enrichedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
          setTotalAmount(total);
        } catch (err) {
          console.error("Failed to load products:", err);
        }
      }
    };

    fetchCartProducts();
  }, [user]);

  const handlePlaceOrder = async () => {
    const orderPayload = {
      userId: user.id,
      items: cart,
      totalAmount,
      status: "pending",
      orderDate: new Date().toISOString(),
    };

    const result = await placeOrder(orderPayload);

    if (result.success) {
      try {
        await axios.patch(`http://localhost:3000/users/${user.id}`, {
          cart: [],
        });

        setUser((prev) => ({ ...prev, cart: [] }));

        alert("Order placed successfully!");
        window.location.href = "/orders";
      } catch (err) {
        console.error("Failed to clear cart:", err);
      }
    } else {
      alert("Order failed.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between border-b py-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <div>
                ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
              </div>
            </div>
          ))}

          <div className="text-right font-bold text-lg mt-4">
            Total: ₹{totalAmount}
          </div>

          <button
            className="mt-6 bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default MyOrders;
