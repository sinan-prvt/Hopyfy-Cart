import { Route, Routes, useLocation } from "react-router-dom";
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Navbar from './Components/Navbar';
import ProductList from './Pages/Product/ProductList';
import ProductCart from './Pages/Product/ProductCart';
import ProductDetails from './Pages/Product/ProductDetails';
import Cart from './Pages/Cart/Cart';
import Wishlistpage from './Pages/WishList/Wishlistpage';
import Wishlist from './Pages/WishList/Wishlist';
import MyOrders from './Pages/Orders/MyOrders';
import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Services/Contact';
import Faq from './Pages/Services/Faq';
import Shipping from './Pages/Services/Shipping';
import Returns from './Pages/Services/Returns';
import PrivacyPolicy from './Pages/Services/PrivacyPolicy';
import TermsAndConditions from './Pages/Services/TermsAndConditions';
import ForgotPassword from './Pages/Services/ForgotPassword';
import SubscribePage from './Pages/Services/SubscribePage';
import AdminRoute from './Routes/AdminRoute';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminAllOrders from './Pages/Admin/AdminAllOrders';
import AdminAllUsers from './Pages/Admin/AdminAllUsers';
import AdminAllProducts from './Pages/Admin/AdminAllProducts';
import EditProduct from './Pages/Admin/EditProduct';
import AdminLayout from './Layout/AdminLayout';
import AddProduct from "./Pages/Admin/AddProduct";
import Toast from "./Components/Toast";
import Checkout from './Pages/Checkout/Checkout';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/product" element={<ProductList />} />
        <Route path="/productcart" element={<ProductCart />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlistpage" element={<Wishlistpage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/subscribe-page" element={<SubscribePage />} />
        <Route path="/toast" element={<Toast />} />

        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="orders" element={<AdminRoute><AdminAllOrders /></AdminRoute>} />
          <Route path="users" element={<AdminRoute><AdminAllUsers /></AdminRoute>} />
          <Route path="products" element={<AdminRoute><AdminAllProducts /></AdminRoute>} />
          <Route path="products/edit/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
          <Route path="/admin/products/add" element={<AdminRoute><AddProduct /></AdminRoute>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
