import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from '../Contexts/AuthContext';
import Footer from './Footer';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="relative h-[550px] overflow-hidden">
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
          <p className="text-lg mb-6">Find your next favorite product here! </p>
          <Link to="/product">
            <button className="bg-white text-black px-6 py-2 rounded hover:bg-gray-300">
              Shop Now
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-9xl mx-auto p-5">
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="flex gap-5 overflow-x-auto scrollbar-hide flex-shrink-0 cursor-pointer relative">
            {products.map(product => (
              <div
                key={product.id}
                className="border rounded-lg p-5 shadow hover:shadow-md transition"
              >
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image?.[0] || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="s-30 w-40 h-100% object-cover rounded mb-5"
                  />
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600 text-sm">{product.category}</p>
                  <p className="font-bold mt-1">₹{product.price}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
