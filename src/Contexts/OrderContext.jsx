import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // ✅ import AuthContext
import api from "../api";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { user, loading } = useAuth(); // ✅ get user & loading from AuthContext

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data } = await api.get("orders/");
      setOrders((data || []).slice().reverse());
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  // ✅ Fetch orders only when user is loaded AND logged in
  useEffect(() => {
    if (!loading && user) {
      fetchOrders();
    }
  }, [loading, user]);

  return (
    <OrderContext.Provider
      value={{ orders, loadingOrders, refreshOrders: fetchOrders }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
