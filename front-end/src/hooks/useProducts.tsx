import { useEffect, useState } from "react";
import Product from "../lib/entities/Product";

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Set loading to true before starting the fetch
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Set loading to false after the fetch is complete
      }
    };

    fetchProducts();
  }, []);

  return { products, loading };
};

export default useProducts;