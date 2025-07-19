import { useState , useEffect } from "react"
import axios from "axios"
import ProductCart from "./ProductCart";


function ProductList(){
    const[products, setProducts] = useState([])

    const fetchproduct = async () => {
        try {
            const res = await axios.get("http://localhost:3000/products?isActive=true")
            setProducts(res.data)
        } catch (error) {
            console.error("Failed to fetch Product", error)
        }
    };

    useEffect(()=> {
        fetchproduct()
    }, [])

    return(
     <div className="px-4 py-6">
  <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
    {products.map((product) => (
      <ProductCart key={product.id} product={product} />
    ))}
  </div>
</div>

    )
}

export default ProductList