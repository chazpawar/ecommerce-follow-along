import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { Plus, RefreshCcw, Loader } from 'lucide-react';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();
  
  const userEmail = localStorage.getItem('userEmail');

  const fetchProducts = async () => {
    if (!userEmail) {
      setError('Please log in to view your products');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/my-products/${userEmail}`
      );

      if (response.data.success) {
        let sortedProducts = [...response.data.products];
        sortProducts(sortedProducts, sortBy);
        setProducts(sortedProducts);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const sortProducts = (products, sortType) => {
    switch (sortType) {
      case 'newest':
        return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'price-high':
        return products.sort((a, b) => b.price - a.price);
      case 'price-low':
        return products.sort((a, b) => a.price - b.price);
      default:
        return products;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [userEmail]);

  useEffect(() => {
    const sortedProducts = [...products];
    sortProducts(sortedProducts, sortBy);
    setProducts(sortedProducts);
  }, [sortBy]);

  const handleProductDelete = (deletedProductId) => {
    setProducts(prevProducts => 
      prevProducts.filter(product => product._id !== deletedProductId)
    );
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your products
          </p>
          <Link
            to="/login"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and monitor your product listings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/create-product')}
                className="bg-black text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors duration-200"
              >
                <Plus size={20} />
                <span>Add Product</span>
              </button>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 disabled:opacity-50"
                title="Refresh products"
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCcw size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
            </div>
            <p className="text-sm text-gray-600">
              {products.length} product{products.length !== 1 ? 's' : ''} listed
            </p>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onDelete={handleProductDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Start by adding your first product</p>
            <button
              onClick={() => navigate('/add-product')}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProducts;
