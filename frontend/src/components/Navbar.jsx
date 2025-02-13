import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white py-4 px-8 flex items-center justify-between border-b">
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
        <Link to="/collection" className="text-gray-600 hover:text-gray-900">Collection</Link>
        <Link to="/cart" className="text-gray-600 hover:text-gray-900">Cart</Link>
        <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
      </div>
      <Link to="/" className="text-2xl font-bold">
        <div className="w-8 h-8 border-2 border-black"></div>
      </Link>
      <div className="flex items-center space-x-6">
        <Link to="/shops" className="text-gray-600 hover:text-gray-900">Shops</Link>
        <Link to="/account" className="text-gray-600 hover:text-gray-900">Account</Link>
        <Search className="w-5 h-5 text-gray-600 cursor-pointer" />
        <div className="w-8 h-8 rounded-full bg-gray-200 cursor-pointer"></div>
      </div>
    </nav>
  );
};

export default Navbar;