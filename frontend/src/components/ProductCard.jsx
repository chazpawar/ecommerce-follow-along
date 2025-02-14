import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(1500px) rotateX(${offsetY / 25}deg) rotateY(${offsetX / 25}deg)`;
    };

    const handleMouseLeave = () => {
      if (cardRef.current) {
        cardRef.current.style.transform = 'perspective(1500px) rotateX(0deg) rotateY(0deg)';
        setIsHovered(false);
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const card = cardRef.current;
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setIsLoading(true);

      const cartResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const existingItem = cartResponse.data.items.find(
       (item) => item.product._id === product._id
     );

      if (existingItem) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/cart/items/${existingItem._id}`,
          { quantity: existingItem.quantity + 1 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/cart/add`,
          {
            productId: product._id,
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
      }

      // Show success message
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 translate-y-0';
      notification.textContent = 'Added to cart!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.transform = 'translateY(100%)';
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 2000);

    } catch (error) {
      console.error("Error managing cart:", error);
      
      // Show error message
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 translate-y-0';
      notification.textContent = error.response?.data?.message || 'Failed to add to cart';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.transform = 'translateY(100%)';
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      ref={cardRef}
      className="group relative bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl"
    >
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={product.images ? `http://localhost:7000${product.images[0]}` : '/api/placeholder/400/300'}
            alt={product.name || 'Product'}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {product.rating && (
            <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full text-sm font-medium text-yellow-500 shadow-md">
              ⭐ {product.rating}
            </div>
          )}
          {product.originalPrice && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </div>
          )}
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
              {product.name || 'Unnamed Product'}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-gray-900">
                ${product.price ? product.price.toFixed(2) : '0.00'}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {product.description && (
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className={`absolute top-4 right-4 bg-white text-gray-600 p-3 rounded-lg shadow-md
          transform transition-all duration-300
          ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
          hover:scale-110 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <ShoppingBag className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default ProductCard;