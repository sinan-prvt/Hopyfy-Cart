import { createContext, useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        toast.error("Failed to load user data");
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
        toast.success(`Welcome back, ${loggedInUser.name}!`);
        return { success: true, user: loggedInUser };
      } else {
        toast.error("Invalid email or password");
        return { success: false, message: "Invalid credentials" };
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      return { success: false, message: "Login failed" };
    }
  };

  const signup = async (userData) => {
    try {
      const res = await axios.post("http://localhost:3000/users", userData);
      localStorage.setItem("userId", res.data.id);
      setUser(res.data);
      toast.success("Account created successfully!");
      return { success: true, user: res.data };
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Registration failed. Please try again.");
      return { success: false, message: "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("userId");
    setUser(null);
    toast.info("You've been logged out");
  };

  const addToWishlist = async (product) => {
    if (!user || !user.id) {
      toast.warn("Please login to add items to your wishlist");
      return;
    }

    try {
      const isAlreadyInWishlist = user?.wishlist?.some(
        (item) => item.id === product.id
      );
      if (isAlreadyInWishlist) {
        toast.info("Item is already in your wishlist");
        return;
      }

      const updatedWishlist = [...(user?.wishlist || []), product];

      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        wishlist: updatedWishlist,
      });

      setUser((prev) => ({ ...prev, wishlist: updatedWishlist }));
      toast.success("Added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist");
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user || !user.id) {
      toast.warn("Please login to manage your wishlist");
      return;
    }

    try {
      const updatedWishlist = user?.wishlist?.filter(
        (item) => item.id !== productId
      );

      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        wishlist: updatedWishlist,
      });

      setUser((prev) => ({ ...prev, wishlist: updatedWishlist }));
      toast.info("Removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    }
  };

  const addToCart = async (product) => {
    if (!user || !user.id) {
      toast.warn("Please login to add items to your cart");
      return;
    }

    const alreadyInCart = user.cart?.some(
      (item) => item.productId === product.id
    );
    if (alreadyInCart) {
      toast.warn("Item is already in your cart");
      return;
    }

    const updatedCart = [
      ...(user.cart || []),
      { productId: product.id, quantity: 1 },
    ];

    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        cart: updatedCart,
      });

      setUser((prev) => ({ ...prev, cart: updatedCart }));
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const moveToCart = async (product) => {
    if (!user || !user.id || !product) {
      toast.warn("Please login to move items to cart");
      return;
    }

    const alreadyInCart = user.cart?.some(
      (item) => item.productId === product.id
    );
    if (alreadyInCart) {
      toast.warn("Item is already in your cart");
      return;
    }

    try {
      const updatedWishlist = user.wishlist?.filter(
        (item) => item.id !== product.id
      );

      const updatedCart = [
        ...(user.cart || []),
        { productId: product.id, quantity: 1 },
      ];

      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        wishlist: updatedWishlist,
        cart: updatedCart,
      });

      const res = await axios.get(`http://localhost:3000/users/${user.id}`);
      setUser(res.data);
      toast.success("Moved to cart!");
    } catch (error) {
      console.error("Error moving to cart:", error);
      toast.error("Failed to move item to cart");
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (!user || !user.id) {
      toast.warn("Please login to update cart items");
      return;
    }

    try {
      const updatedCart = user.cart.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );

      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        cart: updatedCart,
      });

      setUser((prev) => ({ ...prev, cart: updatedCart }));
      toast.info("Cart updated");
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update cart");
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      login,
      signup,
      logout,
      loading,
      setUser,
      addToWishlist,
      removeFromWishlist,
      addToCart,
      moveToCart,
      updateQuantity,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);