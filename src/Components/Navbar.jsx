import { useAuth } from "../Contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";


const Navbar = () => {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const wishlistCount = user?.wishlist?.length || 0;    //wishlist count

  const cartCount = user?.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;  //cart count

  const handleLogout = () => {                 //Logout
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-300 p-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold text-gray-800">🛒 Hopyfy Cart</h1>

      <ul className="Nav">
        <Link to="/" className="mx-2 text-sm text-gray-700 hover:underline">Home</Link>
        <Link to="/product" className="mx-2 text-sm text-gray-700 hover:underline">Product</Link>
        <Link to="/my-orders" className="mx-2 text-sm text-gray-700 hover:underline" >Orders</Link>
        <Link to="/about" className="mx-2 text-sm text-gray-700 hover:underline">About</Link>
      </ul>

      <div className="space-x-4 flex items-center">

         <Link to="/wishlist" className="relative">
          <Heart className="text-red-500" />
          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
              {wishlistCount}
            </span>
          )}
        </Link>
        

        <Link to="/cart" className="relative">
          <span className="text-2xl">🛒</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <>
            <span className="text-gray-600">Hi, {user.name}</span>
            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-3 rounded hover:bg-red-700">
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} className="text-blue-600 hover:underline" >
              Login
            </button>

            <button onClick={() => navigate("/signup")} className="text-blue-600 hover:underline" >
              Signup
            </button>
          </>
        )}
      </div>      
    </nav>
  );
};

export default Navbar;
