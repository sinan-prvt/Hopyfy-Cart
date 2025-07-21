import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Navbar from './Components/Navbar';
import ProductList from './Pages/Product/ProductList';
import ProductCart from './Pages/Product/ProductCart';
import ProductDetails from './Pages/Product/ProductDetails';
import Cart from './Pages/Cart/Cart';
import Wishlistpage from './Pages/WishList/Wishlistpage';
import Wishlist from './Pages/WishList/Wishlist';
import Checkout from './Pages/CheckOut/Checkout';
import MyOrders from './Pages/Orders/MyOrders';
import  Home  from './Pages/Home';
import About from './Pages/About';
import Contact from './Services/Contact';

function App() {
  return (
    <>
          <Navbar /> 
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
            </Routes>
    </>
  );
}

export default App;
