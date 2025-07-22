import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { toast } from "react-toastify";

const Cart = () => {
  const { user, setUser } = useAuth();
  const [cartDetails, setCartDetails] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCartDetails = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/products");
      const allProducts = res.data;

      const details = user?.cart
        ?.map((item) => {
          const product = allProducts.find(
            (p) => String(p?.id) === String(item?.productId)
          );
          return product ? { ...product, quantity: item.quantity } : null;
        })
        .filter(Boolean);

      setCartDetails(details || []);
    } catch (err) {
      console.error("Error fetching cart data:", err);
      toast.error("Failed to load cart items");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    const sum = cartDetails.reduce(
      (acc, item) => acc + item.price * item.quantity, 
      0
    );
    setTotal(sum);
  };

  const handleRemove = async (productId) => {
    try {
      const updatedCart = user.cart.filter(
        (item) => String(item.productId) !== String(productId)
      );

      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        cart: updatedCart,
      });

      setUser({ ...user, cart: updatedCart });
      setCartDetails(prev => prev.filter(item => String(item.id) !== String(productId)));
      
      toast.success("Item removed from cart");
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        handleRemove(productId);
        return;
      }

      const updatedCart = user.cart.map(item => 
        String(item.productId) === String(productId)
          ? { ...item, quantity: newQuantity }
          : item
      );

      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        cart: updatedCart,
      });

      setUser({ ...user, cart: updatedCart });
      setCartDetails(prev =>
        prev.map(item =>
          String(item.id) === String(productId)
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      
      toast.info("Quantity updated");
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Failed to update quantity");
    }
  };

  useEffect(() => {
    if (user) {
      fetchCartDetails();
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading) {
      calculateTotal();
    }
  }, [cartDetails, isLoading]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: -50,
      transition: { duration: 0.2 }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <div className="flex items-center gap-3 mb-8">
        <FiShoppingCart className="text-3xl text-green-600" />
        <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
      </div>

      {cartDetails.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added anything to your cart yet
          </p>
          <Link
            to="/product"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Browse Products
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {cartDetails.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 h-48 md:h-auto">
                    <img
                      src={item.image?.[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        {item.name}
                      </h2>
                      <p className="text-green-600 font-medium text-lg mb-4">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className={`p-2 rounded-full ${item.quantity <= 1 ? 'bg-gray-200 text-gray-400' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                        >
                          <FiMinus size={16} />
                        </button>
                        <span className="text-lg font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                        title="Remove item"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6 mt-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Order Summary</h3>
              <span className="text-gray-500">{cartDetails.length} {cartDetails.length === 1 ? 'item' : 'items'}</span>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-xl font-bold text-green-600">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="flex-1 text-center px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                to="/checkout"
                className="flex-1 text-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
              >
                Proceed to Checkout
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;