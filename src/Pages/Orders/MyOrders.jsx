import { useState, useEffect } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import api from "../../api";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Loader, CheckCircle, Clock, XCircle } from "lucide-react";

const MyOrders = () => {
  const { user } = useAuth();
  const [previousOrders, setPreviousOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getImageUrl = (item) => {
    const product = item.product || item;
    const images = product.images || [];
    if (!images || images.length === 0) return "/placeholder-product.jpg";
    const first = images[0];
    return first.images || first.image_url || "/placeholder-product.jpg";
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("orders/");
        setPreviousOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch previous orders:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const StatusBadge = ({ status }) => {
    const map = {
      pending: { icon: <Clock size={16} />, color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      processing: { icon: <Loader size={16} className="animate-spin" />, color: "bg-blue-100 text-blue-800", label: "Processing" },
      shipped: { icon: <CheckCircle size={16} />, color: "bg-indigo-100 text-indigo-800", label: "Shipped" },
      delivered: { icon: <CheckCircle size={16} />, color: "bg-green-100 text-green-800", label: "Delivered" },
      cancelled: { icon: <XCircle size={16} />, color: "bg-red-100 text-red-800", label: "Cancelled" },
      refunded: { icon: <CheckCircle size={16} />, color: "bg-gray-100 text-gray-700", label: "Refunded" },
    };
    const config = map[status] || map.pending;
    return (
      <span className={`${config.color} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
        {config.icon} {config.label}
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
    <div className="max-w-6xl mx-auto px-4 py-8 md:px-6">
      <div className="flex items-center gap-3 mb-10">
        <ShoppingBag size={32} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
      </div>

      {previousOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <img src="/Images/noorder.png" alt="No Orders" className="w-40 mb-6" />
          <h2 className="text-lg font-medium text-gray-600">You haven’t placed any orders yet</h2>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {previousOrders
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((order, idx) => {
                const items = order.items || [];
                const orderTotal = order.total_amount ?? items.reduce((sum, item) => {
                  const price = Number(item.product?.price ?? item.price ?? 0);
                  const qty = Number(item.quantity ?? 1);
                  return sum + price * qty;
                }, 0);

                return (
                  <motion.div
                    key={order.id || idx}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Order Header */}
                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">Order #{order.id || idx + 1}</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Payment: {order.payment_method}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <ul className="space-y-4 mb-4">
                        {items.map((item, i) => {
                          const product = item.product || {};
                          const name = product.name ?? item.name ?? "Product";
                          const price = Number(product.price ?? item.price ?? 0);
                          const qty = Number(item.quantity ?? 1);
                          const size = item.size ?? "";
                          const color = product.color ?? "";
                          const brand = product.brand ?? "";
                          const material = product.material ?? "";

                          return (
                            <li key={i} className="flex justify-between items-center border-b pb-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={getImageUrl(item)}
                                  alt={name}
                                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                />
                                <div>
                                  <p className="text-gray-700 font-medium">{name}</p>
                                  <p className="text-sm text-gray-500">
                                    {brand && `Brand: ${brand} • `}
                                    {size && `Size: ${size} • `}
                                    {color && `Color: ${color} • `}
                                    {material && `Material: ${material}`}
                                  </p>
                                </div>
                              </div>
                              <span className="text-gray-900 font-medium">
                                ₹{(price * qty).toLocaleString()}
                              </span>
                            </li>
                          );
                        })}
                      </ul>

                      {/* Order Total */}
                      <div className="flex justify-between border-t pt-4">
                        <div className="text-gray-700 font-medium">Order Total</div>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{Number(orderTotal).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
