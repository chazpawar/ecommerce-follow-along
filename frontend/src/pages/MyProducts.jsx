import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard'; // Ensure this path is correct
import axios from 'axios';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Retrieve user email from localStorage or session (make sure it's saved during login)
  const userEmail = localStorage.getItem('userEmail') || ''; 

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userEmail) {
        setError('User email not found. Please log in again.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:7000/api/products/my-products/${userEmail}`);
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [userEmail]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-semibold mb-6">My Products</h1>

        {isLoading ? (
          <p className="text-gray-600">Loading products...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default MyProducts;
