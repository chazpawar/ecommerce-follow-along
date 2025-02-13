import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductForm from './components/ProductForm';
import Home from './components/Home';
import Login from './components/Login';
import NotFound from './components/NotFound'; // New NotFound component

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Simple Navigation */}
        <nav className="bg-blue-600 p-4 text-white">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:underline">Home</Link>
            </li>
            <li>
              <Link to="/login" className="hover:underline">Login</Link>
            </li>
            <li>
              <Link to="/create-product" className="hover:underline">Create Product</Link>
            </li>
          </ul>
        </nav>

        <div className="p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-product" element={<ProductForm />} />
            <Route path="*" element={<NotFound />} /> {/* Catch-all for undefined routes */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
