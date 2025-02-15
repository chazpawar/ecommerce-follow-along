import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Trash2 } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/cart`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setCartItems(response.data.items || []);
      } catch (err) {
        setError('Failed to fetch cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to update cart');
        return;
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart/${productId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.product._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      setError('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to remove items');
        return;
      }

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCartItems(prevItems =>
        prevItems.filter(item => item.product._id !== productId)
      );
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold mb-8">Shopping Cart</h1>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">Your cart is empty</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-8">Shopping Cart</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div key={item.product._id} className="p-6 flex items-center space-x-4">
                <img
                  src={`${import.meta.env.VITE_API_URL}${item.product.images[0]}`}
                  alt={item.product.name}
                  className="h-24 w-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-x border-gray-300">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-between text-lg font-medium">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;