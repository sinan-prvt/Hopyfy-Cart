import { useState, useEffect } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { useOrder } from "../../Contexts/OrderContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ShoppingCart, Loader, CheckCircle, Clock, XCircle } from "lucide-react";

const MyOrders = () => {
  const { user, setUser } = useAuth();
  const { placeOrder } = useOrder();
  const navigate = useNavigate();
  
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Enhanced helper function to handle different image formats
  const getImageUrl = (image) => {
    if (!image) return null;
    
    // Handle array format (either array of strings or array of objects)
    if (Array.isArray(image)) {
      if (image.length === 0) return null;
      const firstImage = image[0];
      
      // If array contains image objects with 'url' property
      if (typeof firstImage === 'object' && firstImage.url) {
        return firstImage.url;
      }
      return firstImage; // Array of strings
    }
    
    // Handle single image object
    if (typeof image === 'object' && image.url) {
      return image.url;
    }
    
    // Handle string format
    if (typeof image === 'string') {
      return image;
    }
    
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Fetch cart products
      if (user?.cart?.length > 0) {
        try {
          const { data: allProducts } = await axios.get("http://localhost:3000/products");
          const enrichedCart = user.cart.map((cartItem) => {
            const product = allProducts.find((p) => p.id === cartItem.productId);
            return {
              ...cartItem,
              name: product?.name || "Unnamed Item",
              price: Number(product?.price) || 0,
              image: product?.image 
            };
          });
          setCart(enrichedCart);
          setTotalAmount(enrichedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
        } catch (err) {
          console.error("Failed to load products:", err);
        }
      }

      // Fetch user orders
      if (user?.id) {
        try {
          const { data } = await axios.get(`http://localhost:3000/order?userId=${user.id}`);
          setPreviousOrders(data);
        } catch (err) {
          console.error("Failed to fetch previous orders:", err);
        }
      }
      
      setIsLoading(false);
    };

    fetchData();
  }, [user]);

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    const orderPayload = {
      userId: user.id,
      items: cart.map(item => ({
        ...item,
        // Ensure we store the image structure correctly
        image: item.image ? (Array.isArray(item.image) ? item.image : [item.image]) : []
      })),
      totalAmount,
      status: "pending",
      orderDate: new Date().toISOString(),
    };

    const result = await placeOrder(orderPayload);

    if (result.success) {
      try {
        await axios.patch(`http://localhost:3000/users/${user.id}`, { cart: [] });
        setUser((prev) => ({ ...prev, cart: [] }));
        setCart([]);
        setTotalAmount(0);
        
        // Redirect to checkout page after placing order
        navigate("/checkout", { state: { orderId: result.orderId } });
      } catch (err) {
        console.error("Failed to clear cart:", err);
      }
    }
    setIsPlacingOrder(false);
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { 
        text: "Pending", 
        icon: <Clock size={16} />, 
        color: "bg-yellow-100 text-yellow-800" 
      },
      processing: { 
        text: "Processing", 
        icon: <Loader size={16} className="animate-spin" />, 
        color: "bg-blue-100 text-blue-800" 
      },
      shipped: { 
        text: "Shipped", 
        icon: <ShoppingCart size={16} />, 
        color: "bg-indigo-100 text-indigo-800" 
      },
      delivered: { 
        text: "Delivered", 
        icon: <CheckCircle size={16} />, 
        color: "bg-green-100 text-green-800" 
      },
      cancelled: { 
        text: "Cancelled", 
        icon: <XCircle size={16} />, 
        color: "bg-red-100 text-red-800" 
      },
      refunded: { 
        text: "Refunded", 
        icon: <CheckCircle size={16} className="text-green-500" />, 
        color: "bg-gray-100 text-gray-700" 
      }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`${config.color} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag size={32} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
      </div>

      {/* Current Cart Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-6 mb-12"
      >
        <div className="flex items-center gap-2 mb-6">
          <ShoppingCart size={24} className="text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-800">Current Cart</h2>
        </div>
        
        {cart.length === 0 ? (
          <div className="text-center py-10">
            <div className="flex justify-center mb-4">
              <div className="text-6xl mb-4">🛒</div>
            </div>
            <p className="text-gray-600">Your cart is empty</p>
            <button 
              onClick={() => window.location.href = "/product"}
              className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map((item, index) => {
                const imageUrl = getImageUrl(item.image);
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={item.name}
                            className="absolute inset-0 w-full h-full object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.classList.add('hidden');
                              e.target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`bg-gray-200 border-2 border-dashed border-gray-400 rounded-xl w-full h-full ${imageUrl ? 'hidden' : ''}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="font-medium text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="flex justify-between items-center border-t pt-4">
              <div>
                <p className="text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-8 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
              >
                {isPlacingOrder ? (
                  <div className="flex items-center gap-2">
                    <Loader className="animate-spin" size={20} />
                    Processing...
                  </div>
                ) : (
                  "Place Order"
                )}
              </motion.button>
            </div>
          </>
        )}
      </motion.section>

      {/* Previous Orders Section */}
      <section className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Order History</h2>
        
        {previousOrders.length === 0 ? (
          <div className="text-center py-10">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-200 border-2 border-dashed border-gray-400 rounded-xl w-16 h-16" />
            </div>
            <p className="text-gray-600">You haven't placed any orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {previousOrders
                .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                .map((order, idx) => (
                  <motion.div
                    key={order.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Order #{order.id || idx + 1}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.orderDate).toLocaleString()}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    
                    <div className="p-6">
                      <ul className="space-y-3 mb-4">
                        {order.items.map((item, i) => {
                          // Extract image URL from item
                          const imageUrl = getImageUrl(item.image);
                          
                          return (
                            <li key={i} className="flex justify-between">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12">
                                  {/* Fixed image rendering */}
                                  {imageUrl ? (
                                    <img 
                                      src={imageUrl} 
                                      alt={item.name}
                                      className="absolute inset-0 w-full h-full object-cover rounded-lg border border-gray-200"
                                      onError={(e) => {
                                        e.target.classList.add('hidden');
                                        e.target.nextElementSibling?.classList.remove('hidden');
                                      }}
                                    />
                                  ) : null}
                                  {/* Fixed placeholder with correct classes */}
                                  <div className={`bg-gray-200 border-2 border-dashed border-gray-400 rounded-xl w-full h-full ${imageUrl ? 'hidden' : ''}`} />
                                </div>
                                <span className="text-gray-700">{item.name}</span>
                              </div>
                              <span className="text-gray-900 font-medium">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                      
                      <div className="flex justify-between border-t pt-4">
                        <div className="text-gray-700">Order Total</div>
                        <div className="text-lg font-bold text-gray-900">
                          ₹{order.totalAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              }
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
};

export default MyOrders;