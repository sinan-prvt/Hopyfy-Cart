// ProductList.jsx
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ProductCart from "./ProductCart";
import Footer from "../Footer";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products?isActive=true");
      setProducts(res.data);
      
      // Extract unique categories
      const uniqueCategories = [
        "All",
        ...new Set(res.data.map((p) => p.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Failed to fetch Product", error);
    }
  };

  // Memoized filtered and sorted products
  const processedProducts = useMemo(() => {
    let result = [...products];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(p => 
        (p.name?.toLowerCase()?.includes(term)) ||
        (p.brand?.toLowerCase()?.includes(term)) ||
        (p.category?.toLowerCase()?.includes(term))
      );
    }
    
    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Price range filter
    result = result.filter(p => 
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    
    // Sorting
    if (sortOption === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    }
    
    return result;
  }, [products, searchTerm, selectedCategory, priceRange, sortOption]);

  useEffect(() => {
    setFilteredProducts(processedProducts);
  }, [processedProducts]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Shop Products</h1>
        <p className="text-gray-600">Discover our premium collection</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col gap-6">
          {/* Search Bar */}
          <div>
            <h3 className="font-semibold mb-2">Search Products</h3>
            <input
              type="text"
              placeholder="Search by name, brand, or category"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <h3 className="font-semibold mb-2">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="font-semibold mb-2">
                Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
              </h3>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-blue-600"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹0</span>
                <span>₹100000</span>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h3 className="font-semibold mb-2">Sort By</h3>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCart key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700">No products found</h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
}

export default ProductList;