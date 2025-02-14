import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductForm from './components/ProductForm';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import NotFound from './components/NotFound';
import MyProducts from './pages/MyProducts'; // Import the MyProducts component

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-gray-600 p-4 text-white">
          <ul className="flex space-x-20">
            <li>
              <Link to="/" className="hover:underline">Home</Link>
            </li>
            <li>
              <Link to="/login" className="hover:underline">Login</Link>
            </li>
            <li>
              <Link to="/signup" className="hover:underline">Sign Up</Link>
            </li>
            <li>
              <Link to="/create-product" className="hover:underline">Create Product</Link>
            </li>
            <li>
              <Link to="/my-products" className="hover:underline">My Products</Link>
            </li>
          </ul>
        </nav>

        <div className="p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create-product" element={<ProductForm />} />
            <Route path="/my-products" element={<MyProducts />} /> {/* My Products route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
