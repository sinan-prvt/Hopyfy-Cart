import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from '../Contexts/AuthContext';

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
      {/* Hero Section */}
      <div className="bg-gray-100 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to MyShop</h1>
        <p className="text-lg text-gray-700 mb-6">Find your next favorite product here!</p>
        <Link to="/product">
          <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
            Shop Now
          </button>
        </Link>
      </div>

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(product => (
              <div
                key={product.id}
                className="border rounded-lg p-4 shadow hover:shadow-md transition"
              >
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.images?.[0] || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600 text-sm">{product.category}</p>
                  <p className="font-bold mt-1">₹{product.price}</p>
                </Link>

                {user && (
                  <div className="mt-3 flex gap-2">
                    <button className="text-sm px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Add to Cart
                    </button>
                    <button className="text-sm px-2 py-1 bg-pink-500 text-white rounded hover:bg-pink-600">
                      Wishlist
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home
