import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { FiLogOut, FiHome, FiPackage, FiShoppingCart, FiUsers, FiSettings } from "react-icons/fi";
import { useEffect, useState } from "react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [userInfo, setUserInfo] = useState({
    name: "Loading...",
    email: "loading@example.com"
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch admin user data from db.json
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3000/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        
        // Find the admin user
        const adminUser = data.find(user => 
          user.role === "admin" && user.email === "admin@gmail.com"
        );
        
        if (adminUser) {
          setUserInfo({
            name: adminUser.name,
            email: adminUser.email
          });
        } else {
          throw new Error('Admin user not found');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserInfo({
          name: "Admin User",
          email: "admin@example.com"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Update page title based on current route
  useEffect(() => {
    const path = location.pathname;
    const titles = {
      "/admin/dashboard": "Dashboard",
      "/admin/products": "Products",
      "/admin/orders": "Orders",
      "/admin/users": "Users"
    };
    
    // Fallback to last part of path if not found
    setPageTitle(
      titles[path] || 
      path.split("/").pop().charAt(0).toUpperCase() + path.split("/").pop().slice(1)
    );
  }, [location]);

  const handleLogout = () => {
    console.log("Admin logged out");
    navigate("/login");
  };

  const navLinkStyle = ({ isActive }) => 
    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-600' 
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
              <FiSettings className="text-white text-lg" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>
          
          <nav className="space-y-1 mb-6">
            <NavLink to="/admin/dashboard" className={navLinkStyle}>
              <FiHome className="mr-3 text-lg" />
              Dashboard
            </NavLink>
            
            <NavLink to="/admin/products" className={navLinkStyle}>
              <FiPackage className="mr-3 text-lg" />
              Products
            </NavLink>
            
            <NavLink to="/admin/orders" className={navLinkStyle}>
              <FiShoppingCart className="mr-3 text-lg" />
              Orders
            </NavLink>
            
            <NavLink to="/admin/users" className={navLinkStyle}>
              <FiUsers className="mr-3 text-lg" />
              Users
            </NavLink>
          </nav>
        </div>
        
        {/* Logout section */}
        <div className="mt-auto p-6 pt-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-sm mr-3">
              {isLoading ? "..." : userInfo.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 truncate max-w-[130px]">
                {isLoading ? "Loading..." : userInfo.name}
              </p>
              <p className="text-xs text-gray-500 truncate max-w-[130px]">
                {isLoading ? "loading@example.com" : userInfo.email}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200 border border-gray-200 text-sm font-medium"
          >
            <FiLogOut className="mr-2 text-base" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen">
        <header className="bg-white shadow-sm z-10">
          <div className="flex justify-between items-center py-4 px-6">
            <h2 className="text-lg font-medium text-gray-800 capitalize">
              {pageTitle}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full absolute top-0 right-0 border-2 border-white"></div>
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                  {isLoading ? "..." : userInfo.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;