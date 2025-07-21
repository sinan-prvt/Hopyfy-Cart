import { useState, useEffect } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import axios from "axios";

const Checkout = () => {
  const { user, setUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [name, setName] = useState("");                         // User input fields
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState(""); 
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
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

  const validateFields = () => {
    if (!name || !address || !phone || !paymentMode) {
      alert("Please fill all required fields.");
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Phone number must be 10 digits.");
      return false;
    }

    if (paymentMode === "card") {
      if (!/^\d{16}$/.test(cardNumber)) {
        alert("Card number must be 16 digits.");
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert("Expiry must be in MM/YY format.");
        return false;
      }
      if (!/^\d{3}$/.test(cvv)) {
        alert("CVV must be 3 digits.");
        return false;
      }
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!user || cartItems.length === 0) return;
    if (!validateFields()) return;

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
      status: paymentMode === "cod" ? "pending" : "paid",
      shippingDetails: {
        name,
        address,
        phone,
      },
      payment: {
        method: paymentMode,
        ...(paymentMode === "card" && {
          cardLast4: cardNumber.slice(-4),
        }),
      },
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

          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold">Shipping Information</h2>

            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              placeholder="Address"
              className="w-full border p-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="w-full border p-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
            />

            <h2 className="text-lg font-semibold">Payment Method</h2>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMode === "card"}
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                Card
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMode === "cod"}
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                Cash on Delivery
              </label>
            </div>

            {paymentMode === "card" && (
              <div className="space-y-2 mt-2">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full border p-2"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={16}
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-1/2 border p-2"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    maxLength={5}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-1/2 border p-2"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={3}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            className="w-full mt-6 bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
            onClick={handlePlaceOrder}
          >
            Confirm & Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;