import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const userId = localStorage.getItem("userId");
  console.log("User ID from localStorage:", userId);


  const fetchOrders = async () => {                  
    if (userId) {
      try {
        const res = await axios.get(`http://localhost:3000/order?userId=${userId}`);
        setOrders(res.data.reverse()); 
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    setLoadingOrders(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const placeOrder = async (newOrder) => {             
    try {
      const res = await axios.post("http://localhost:3000/order", newOrder);
      setOrders((prev) => [res.data, ...prev]);
      return { success: true };
    } catch (error) {
      console.error("Order placement failed:", error);
      return { success: false };
    }
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, loadingOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
