import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from '../Contexts/AuthContext';
import Footer from './Footer';
import { ChevronLeft, ChevronRight, ArrowRight, Star, Heart, ShoppingCart, Truck, Shield, Headphones, RefreshCw } from 'lucide-react'; 

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
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

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      navigate(`/subscribe-page`);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/products");
        const filtered = data.filter(p => p.isActive !== false);
        setProducts(filtered.slice(0, 8));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const brands = [
    { id: 1, name: "Nike", logo: "/Icons/nike.png" },
    { id: 2, name: "Adidas", logo: "/Icons/adidas.png" },
    { id: 3, name: "Puma", logo: "/Icons/puma.png" },
    { id: 4, name: "Reebok", logo: "/Icons/reebok.png" },
    { id: 5, name: "New Balance", logo: "/Icons/newbalance.png" },
    { id: 6, name: "Jordan", logo: "/Icons/jordan.png" },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Fashion Enthusiast",
      content: "The quality of products at Hopyfy Cart is unmatched. Fast shipping and excellent customer service!",
      rating: 5
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Sneaker Collector",
      content: "I've been shopping here for years. Their exclusive releases are always on point and arrive in perfect condition.",
      rating: 4
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Professional Athlete",
      content: "As an athlete, I need reliable footwear. Hopyfy Cart never disappoints with their premium selections.",
      rating: 5
    }
  ];

  return (
    <div className="overflow-hidden bg-white">
      <div className="relative h-[90vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/80 z-10"></div>
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src="/Videos/Shoe.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
              Elevate Your Style
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Premium footwear for every occasion
            </p>
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
      </div>

      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Brands We Carry</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
            {brands.map(brand => (
              <div key={brand.id} className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-20 h-20 flex items-center justify-center mb-3">
                  <img src={brand.logo} alt={brand.name} className="max-h-16 max-w-16 object-contain" />
                </div>
                <span className="text-sm font-medium text-gray-700">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link to="/product" className="text-blue-600 hover:underline flex items-center gap-1 font-medium">
            View All <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl h-60 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                    <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                    {product.discountPercentage > 0 && (
                      <div className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">
                        -{product.discountPercentage}%
                      </div>
                    )}
                  </div>
                  
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="relative overflow-hidden rounded-lg mb-4 h-60">
                      <img
                        src={product.image?.[0] || "https://via.placeholder.com/300"}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {product.category}
                          </span>
                          <h3 className="text-lg font-semibold mt-2 line-clamp-1">{product.name}</h3>
                        </div>
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium ml-1">{product.rating || '4.5'}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <p className="font-bold text-lg text-gray-900">₹{product.price}</p>
                        {product.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">₹{product.originalPrice}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                  
                  <button className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative my-16 overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden">
          <div className="relative h-[400px] md:h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10"></div>
            <img
              src="/Images/ad1.jpg"
              alt="Nike promotion"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center px-6 md:px-12">
              <div className="max-w-lg text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-wider">AIR</h2>
                <p className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  GRAVITY WILL NEVER<br />
                  BE THE SAME
                </p>
                <Link to="/product?brand=nike">
                  <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full hover:bg-gray-100 font-medium group transition-all">
                    Shop Nike Collection
                    <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Hopyfy Cart</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We're committed to providing the best shopping experience with premium products and exceptional service</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="./Icons/fast.png" className="h-11" />
              </div>
              <h4 className="font-bold text-lg mb-2">Fast & Free Delivery</h4>
              <p className="text-gray-600">Get your products within 2-4 days with our express shipping.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="./Icons/secure.png" className="h-11" />
              </div>
              <h4 className="font-bold text-lg mb-2">Secure Payments</h4>
              <p className="text-gray-600">100% encrypted & trusted payment options with SSL protection.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="./Icons/24.png" className="h-11" />
              </div>
              <h4 className="font-bold text-lg mb-2">24/7 Support</h4>
              <p className="text-gray-600">Chat, Email, and Phone support available anytime you need help.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="./Icons/distribution.png" className="h-11" />
              </div>
              <h4 className="font-bold text-lg mb-2">Easy Returns</h4>
              <p className="text-gray-600">No-hassle returns within 30 days with our satisfaction guarantee.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Don't just take our word for it - hear from our satisfied customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="ml-4">
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/Images/texture.png')] opacity-10 z-0"></div>
        <div className="container max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold mb-4">Join the Hopyfy Community</h2>
          <p className="mb-8 text-blue-100 max-w-2xl mx-auto">
            Subscribe to get updates on new arrivals, exclusive discounts, and special promotions.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row justify-center gap-3 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-5 py-3 rounded-lg w-full text-white bg-white/10 border border-white/20 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/70"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 whitespace-nowrap transition-all shadow-lg"
            >
              Subscribe
            </button>
          </form>
          <p className="text-blue-200 text-sm mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;