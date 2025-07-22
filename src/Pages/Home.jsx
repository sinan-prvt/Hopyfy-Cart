import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from '../Contexts/AuthContext';
import Footer from './Footer';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'; 

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
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-[600px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/Videos/Shoe.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/70 to-black/30 z-10"></div>
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-white px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Hopyfy Cart</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">Find your next favorite product at unbeatable prices!</p>
          <Link to="/product">
  <button className="group relative w-48 h-12 overflow-hidden rounded-full text-white font-bold uppercase tracking-wider">
    <span className="absolute left-0 top-0 h-12 w-12 rounded-full bg-gray-900 shadow-md transition-all duration-500 ease-out group-hover:w-full group-hover:shadow-lg group-active:scale-90"></span>
    
    <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-0.5 bg-white transition-all duration-500 ease-out group-hover:translate-x-36 group-active:translate-x-[150px]">
      <span className="absolute top-[-6px] right-[2px] w-2.5 h-2.5 border-t-2 border-r-2 border-white rotate-45"></span>
    </span>

    <span className="relative z-10 transition-all duration-500 ease-out group-hover:text-white group-hover:-translate-x-7 group-active:text-gray-300">
      Shop Now
    </span>
  </button>
</Link>

        </div>
      </div>

      {/* Brand Showcase 1 - Nike */}
      <div className="relative h-[500px] overflow-hidden my-16">
        <div className="absolute inset-0 bg-cover bg-center" style={{ 
          backgroundImage: `url('/Images/ad1.jpg')`,
          backgroundPosition: 'center center'
        }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent z-10"></div>
        <div className="container mx-auto relative z-20 h-full flex items-center px-6">
          <div className="max-w-md text-white">
            <h2 className="text-5xl font-bold mb-4 uppercase tracking-wider">AIR</h2>
            <p className="text-4xl font-bold mb-6 leading-tight">
              GRAVITY WILL NEVER<br />
              BE THE SAME
            </p>
            <Link to="/product?brand=nike">
              <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full hover:bg-gray-300 font-medium group">
                Shop Nike Collection
                <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/product" className="text-blue-600 hover:underline flex items-center gap-1">
            View All <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found.</p>
          </div>
        ) : (
          <div className="relative">
            <button 
              onClick={() => scroll('left')} 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 hidden md:block"
            >
              <ChevronLeft size={24} />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hidden scroll-smooth px-1 md:px-10 pb-4"
            >
              {products.map(product => (
                <div
                  key={product.id}
                  className="border rounded-xl p-4 shadow hover:shadow-xl min-w-[250px] flex-shrink-0 transition-all duration-300 group"
                >
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={product.image?.[0] || "https://via.placeholder.com/300"}
                        alt={product.name}
                        className="w-full h-60 object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div>
                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {product.category}
                      </span>
                      <h3 className="text-lg font-semibold mt-2 line-clamp-1">{product.name}</h3>
                      <p className="font-bold mt-1 text-lg">₹{product.price}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <button 
              onClick={() => scroll('right')} 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 hidden md:block"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Brand Showcase 2 - Adidas */}
      <div className="relative h-[500px] overflow-hidden my-16">
        <div className="absolute inset-0 bg-cover bg-center" style={{ 
          backgroundImage: `url('/Images/ad2.jpg')`,
          backgroundPosition: 'center center'
        }}></div>
        <div className="absolute inset-0 bg-gradient-to-l from-black/90 to-transparent z-10"></div>
        <div className="container mx-auto relative z-20 h-full flex items-center justify-end px-6">
          <div className="max-w-md text-white text-right">
            <h2 className="text-5xl font-bold mb-4 uppercase tracking-wider">SUPERSTAR</h2>
            <p className="text-4xl font-bold mb-6 leading-tight">
              ORIGINAL SINCE<br />
              1969
            </p>
            <Link to="/product?brand=adidas">
              <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full hover:bg-gray-300 font-medium group ml-auto">
                Shop Adidas Collection
                <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-100 py-16 px-6 ">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We're committed to providing the best shopping experience</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="/Icons/fast.png" alt="Shipping" className="w-8" />
              </div>
              <h4 className="font-bold text-lg mb-2">Fast Delivery</h4>
              <p className="text-gray-600">Get your products within 2–4 days.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="/Icons/secure.png" alt="Secure" className="w-8" />
              </div>
              <h4 className="font-bold text-lg mb-2">Secure Payments</h4>
              <p className="text-gray-600">100% encrypted & trusted payment options.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="/Icons/24.png" alt="Support" className="w-8" />
              </div>
              <h4 className="font-bold text-lg mb-2">24/7 Support</h4>
              <p className="text-gray-600">Chat, Email, and Phone support available.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="/Icons/distribution.png" alt="Returns" className="w-8" />
              </div>
              <h4 className="font-bold text-lg mb-2">Easy Returns</h4>
              <p className="text-gray-600">No-hassle returns within 7 days.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-black text-white py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 z-0"></div>
        <div className="container max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold mb-4">Stay in the loop</h2>
          <p className="mb-8 text-gray-300 max-w-2xl mx-auto">
            Subscribe to get updates on new arrivals, exclusive discounts, and special promotions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-5 py-3 rounded-lg w-full text-white bg-black/30 border border-white/30 focus:border-white focus:outline-none"
            />
            <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-300 whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;