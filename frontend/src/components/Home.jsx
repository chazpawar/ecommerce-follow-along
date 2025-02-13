import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const Home = () => {
  const sampleProducts = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      image: '/api/placeholder/300/200',
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      image: '/api/placeholder/300/200',
    },
    {
      id: 3,
      name: 'Gaming Mouse',
      price: 49.99,
      image: '/api/placeholder/300/200',
    },
    {
      id: 4,
      name: 'Bluetooth Speaker',
      price: 79.99,
      image: '/api/placeholder/300/200',
    },
    {
      id: 5,
      name: '4K Monitor',
      price: 299.99,
      image: '/api/placeholder/300/200',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold">TechStore</Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-blue-400 transition-colors duration-300">Home</Link>
              <Link to="/products" className="hover:text-blue-400 transition-colors duration-300">Products</Link>
              <Link to="/categories" className="hover:text-blue-400 transition-colors duration-300">Categories</Link>
              <Link to="/contact" className="hover:text-blue-400 transition-colors duration-300">Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
              <button className="hover:text-blue-400 transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <Link to="/cart" className="hover:text-blue-400 transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </Link>
              <Link to="/login" className="hover:text-blue-400 transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gradient-to-br from-gray-900 via-black to-white">
        <div className="container mx-auto p-8">
          <h1 className="text-4xl font-bold mb-8 text-white text-center">Our Products</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-400">Your one-stop shop for all things tech. Quality products, competitive prices, and excellent customer service.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">About Us</Link></li>
                <li><Link to="/products" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Products</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Terms & Conditions</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@techstore.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>Address: 123 Tech Street</li>
                <li>City, State 12345</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates and exclusive offers.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-700 bg-gray-800"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} TechStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;