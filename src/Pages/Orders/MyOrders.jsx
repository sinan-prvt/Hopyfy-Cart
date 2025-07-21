import { useState, useEffect } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { useOrder } from "../../Contexts/OrderContext";
import axios from "axios";

const MyOrders = () => {
  const { user, setUser } = useAuth();
  const { placeOrder } = useOrder();

  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [previousOrders, setPreviousOrders] = useState([]);

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

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (user?.id) {
        try {
          const { data } = await axios.get(`http://localhost:3000/order?userId=${user.id}`);
          setPreviousOrders(data);
        } catch (err) {
          console.error("Failed to fetch previous orders:", err);
        }
      }
    };

    fetchUserOrders();
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
        await axios.patch(`http://localhost:3000/users/${user.id}`, { cart: [] });
        setUser((prev) => ({ ...prev, cart: [] }));
        alert("Order placed successfully!");
        window.location.reload(); 
      } catch (err) {
        console.error("Failed to clear cart:", err);
      }
    } else {
      alert("Order failed.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🛒 My Orders</h1>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Current Cart</h2>
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
            <div className="text-right font-bold text-lg mt-4">Total: ₹{totalAmount}</div>
            <button
              className="mt-6 bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Previous Orders</h2>
        {previousOrders.length === 0 ? (
          <p>You haven’t placed any orders yet.</p>
        ) : (
          previousOrders
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
            .map((order, idx) => (
              <div key={idx} className="border rounded p-4 mb-4 bg-gray-50">
                <p className="font-semibold text-gray-700">
                  Order #{order.id || idx + 1} —{" "}
                  <span className="text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleString()}
                  </span>
                </p>
                <ul className="mt-2 space-y-1">
                  {order.items.map((item, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span>
                        ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="text-right mt-2 font-semibold">
                  Total: ₹{order.totalAmount} —{" "}
                  <span className="capitalize text-green-600">{order.status}</span>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
