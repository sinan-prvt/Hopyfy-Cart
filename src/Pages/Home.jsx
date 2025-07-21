import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from '../Contexts/AuthContext';
import Footer from './Footer';
import { ChevronLeft, ChevronRight } from 'lucide-react'; 

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/products");
        const filtered = data.filter(p => p.isActive !== false);
        setProducts(filtered.slice(0, 6));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <div className="relative h-[600px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/Videos/Shoe.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-white px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Hopyfy Cart</h1>
          <p className="text-lg mb-6">Find your next favorite product here!</p>
          <Link to="/product">
            <button className="bg-white text-black px-6 py-2 rounded hover:bg-gray-300">
              Shop Now
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="relative">
            <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100" >
              <ChevronLeft />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hidden scroll-smooth px-10"
            >
              {products.map(product => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 shadow hover:shadow-md min-w-[220px] flex-shrink-0"
                >
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image?.[0] || "https://via.placeholder.com/300"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded mb-3"
                    />
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-gray-600 text-sm">{product.category}</p>
                    <p className="font-bold mt-1">₹{product.price}</p>
                  </Link>
                </div>
              ))}
            </div>

            <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100" >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-100 py-12 px-6 ">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <img src="/Icons/fast.png" alt="Shipping" className="w-12 mx-auto mb-2 " />
            <h4 className="font-semibold ">Fast Delivery</h4>
            <p className="text-sm text-gray-600">Get your products within 2–4 days.</p>
          </div>
          <div>
            <img src="/Icons/secure.png" alt="Secure" className="w-12 mx-auto mb-2" />
            <h4 className="font-semibold">Secure Payments</h4>
            <p className="text-sm text-gray-600">100% encrypted & trusted payment options.</p>
          </div>
          <div>
            <img src="/Icons/24.png" alt="Support" className="w-12 mx-auto mb-2" />
            <h4 className="font-semibold">24/7 Support</h4>
            <p className="text-sm text-gray-600">Chat, Email, and Phone support available.</p>
          </div>
          <div>
            <img src="/Icons/distribution.png" alt="Returns" className="w-12 mx-auto mb-2" />
            <h4 className="font-semibold">Easy Returns</h4>
            <p className="text-sm text-gray-600">No-hassle returns within 7 days.</p>
          </div>
        </div>
      </div>

      <div className="bg-black text-white py-12 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Stay in the loop</h2>
        <p className="mb-6">Subscribe to get updates on new arrivals, discounts, and more.</p>
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-l w-64 text-white bg-transparent border border-white"
          />
          <button className="bg-white text-black px-4 py-2 rounded-r hover:bg-gray-300">Subscribe</button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
