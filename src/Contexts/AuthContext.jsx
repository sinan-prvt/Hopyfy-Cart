import { createContext, useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:3000/users/${userId}`);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  const login = async (email, password) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/users?email=${email}&password=${password}`
      );
      if (res.data.length === 1) {
        const loggedInUser = res.data[0];
        localStorage.setItem("userId", loggedInUser.id);
        setUser(loggedInUser);
        return { success: true, role: loggedInUser.role };
      } else {
        return { success: false, message: "Invalid credentials" };
      }
    } catch (error) {
      return { success: false, message: "Login failed" };
    }
  };

  const signup = async (userData) => {
    try {
      const res = await axios.post("http://localhost:3000/users", userData);
      localStorage.setItem("userId", res.data.id);
      setUser(res.data);
      return { success: true, role: res.data.role };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, message: "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("userId");
    setUser(null);
  };

  const addToWishlist = async (product) => {
    try {
      const isAlreadyInWishlist = user?.wishlist?.some(
        (item) => item.id === product.id
      );
      if (isAlreadyInWishlist) return;

      const updatedWishlist = [...(user?.wishlist || []), product];

      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        wishlist: updatedWishlist,
      });

      setUser((prev) => ({ ...prev, wishlist: updatedWishlist }));
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const updatedWishlist = user?.wishlist?.filter(
        (item) => item.id !== productId
      );

      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        wishlist: updatedWishlist,
      });

      setUser((prev) => ({ ...prev, wishlist: updatedWishlist }));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const moveToCart = async (product) => {
    if (!user || !product) return;

    const alreadyInCart = user.cart?.some(
      (item) => item.productId === product.id
    );
    if (alreadyInCart) {
      alert("Item already in cart.");
      return;
    }

    const updatedWishlist = user.wishlist?.filter(
      (item) => item.id !== product.id
    );

    const updatedCart = [
      ...(user.cart || []),
      { productId: product.id, quantity: 1 },
    ];

    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        wishlist: updatedWishlist,
        cart: updatedCart,
      });

      const res = await axios.get(`http://localhost:3000/users/${user.id}`);
      setUser(res.data);
    } catch (error) {
      console.error("Error moving to cart:", error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (!user) return;

    const updatedCart = user.cart.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );

    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        cart: updatedCart,
      });

      setUser((prev) => ({ ...prev, cart: updatedCart }));
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const contextValue = useMemo(() => ({
    user,
    login,
    signup,
    logout,
    loading,
    setUser,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    updateQuantity,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
