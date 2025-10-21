import { useState, useEffect } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { motion } from "framer-motion";
import { CreditCard, Wallet, Truck, CheckCircle } from "lucide-react";

const Checkout = () => {
  const { cart, checkout } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState(""); 
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    const detailedCart = (cart || []).map((item) => {
      const price = Number(item.product?.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return {
        id: item.product?.id,
        name: item.product?.name,
        image: item.product?.images || [],
        price,
        quantity,
        subtotal: price * quantity,
      };
    });
    setCartItems(detailedCart);
    const total = detailedCart.reduce((sum, i) => sum + i.subtotal, 0);
    setTotalAmount(total);
  }, [cart]);
  
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
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        alert("Expiry must be in MM/YY format.");
        return false;
      }
      if (!/^\d{3}$/.test(cvv)) {
        alert("CVV must be 3 digits.");
        return false;
      }
    }
    
    if (paymentMode === "upi") {
      if (!/^[\w.-]+@[\w.-]+$/.test(upiId) && !/^[\w.-]+\$[\w.-]+$/.test(upiId)) {
        alert("Please enter a valid UPI ID (e.g., example@upi or example$bank)");
        return false;
      }
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    if (!validateFields()) return;
    setIsPlacingOrder(true);
    const method = paymentMode === "card" ? "CARD" : paymentMode === "upi" ? "UPI" : "COD";
    const result = await checkout(method);
    setIsPlacingOrder(false);
    if (result?.success) {
      window.location.href = "/my-orders";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle size={32} className="text-green-600" />
        <h1 className="text-3xl font-bold text-gray-800">Secure Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-10">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                <p className="text-gray-600">Your cart is empty</p>
                <button 
                  onClick={() => window.location.href = "/products"}
                  className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        <img 
                          src={Array.isArray(item.image) ? (item.image[0] || "") : item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="font-medium text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Shipping Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <textarea
                  placeholder="Enter complete address"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Method</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg text-left transition-all ${
                    paymentMode === "card" 
                      ? "border-blue-600 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMode("card")}
                >
                  <CreditCard size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-sm text-gray-500">Pay with Visa, Mastercard, etc.</p>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg text-left transition-all ${
                    paymentMode === "upi" 
                      ? "border-purple-600 bg-purple-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMode("upi")}
                >
                  <Wallet size={20} className="text-purple-600" />
                  <div>
                    <p className="font-medium">UPI Payment</p>
                    <p className="text-sm text-gray-500">Pay via UPI apps</p>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg text-left transition-all ${
                    paymentMode === "cod" 
                      ? "border-green-600 bg-green-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMode("cod")}
                >
                  <Truck size={20} className="text-green-600" />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive</p>
                  </div>
                </motion.button>
              </div>
              
              {paymentMode === "card" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setCardNumber(value);
                      }}
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date (MM/YY)
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={expiry}
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value.length === 2 && !value.includes('/')) {
                            value = value + '/';
                          }
                          setExpiry(value);
                        }}
                        maxLength={5}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        placeholder="123"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength={3}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {paymentMode === "upi" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Example: name@bankname or name$bankname
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-sm text-purple-800">
                      After placing order, you'll be redirected to your UPI app for payment
                    </p>
                  </div>
                </motion.div>
              )}
              
              {paymentMode === "cod" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4"
                >
                  <p className="text-sm text-green-800">
                    Pay with cash when your order is delivered. An extra ₹50 may be charged for COD orders.
                  </p>
                </motion.div>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">FREE</span>
              </div>
            
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-300">
                <span>Total</span>
                <span>₹{(totalAmount ).toFixed(2)}</span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || cartItems.length === 0}
              className={`w-full mt-6 py-3 px-4 rounded-lg font-bold shadow-lg transition-all ${
                cartItems.length === 0 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              }`}
            >
              {isPlacingOrder ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Payment...
                </div>
              ) : (
                `Place Order - ₹${(totalAmount ).toFixed(2)}`
              )}
            </motion.button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              Your personal data will be used to process your order and support your experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;