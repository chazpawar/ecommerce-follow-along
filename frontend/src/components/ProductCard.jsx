import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Edit, Trash2, AlertCircle } from 'lucide-react';

const ProductCard = ({ product, onDelete }) => {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState(null);

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `
      fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transform transition-all duration-300
      flex items-center space-x-2 z-50
      ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white
    `;

    const icon = document.createElement('span');
    icon.innerHTML = type === 'success' 
      ? '✓'
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>`;
    
    const text = document.createElement('span');
    text.textContent = message;

    notification.appendChild(icon);
    notification.appendChild(text);
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateY(-1rem)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
      notification.style.transform = 'translateY(100%)';
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Show confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?\nThis action cannot be undone.'
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/products/delete/${product._id}`,
        {
          data: { userEmail: localStorage.getItem('userEmail') }
        }
      );

      if (response.data.success) {
        showNotification('Product deleted successfully');
        if (onDelete) {
          onDelete(product._id);
        } else {
          // Fallback to page reload if no onDelete handler
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else {
        throw new Error(response.data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.response?.data?.message || 'Failed to delete product');
      showNotification(
        error.response?.data?.message || 'Failed to delete product',
        'error'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const card = cardRef.current;
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;
      
      const sensitivity = 25; // Lower number = more sensitive
      card.style.transform = `
        perspective(1500px)
        rotateX(${offsetY / sensitivity}deg)
        rotateY(${offsetX / sensitivity}deg)
      `;
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
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
      card.addEventListener('mouseenter', handleMouseEnter);

      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
        card.removeEventListener('mouseenter', handleMouseEnter);
      };
    }
  }, []);

  return (
    <div 
      ref={cardRef}
      className="group relative bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl"
    >
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={product.images ? `${import.meta.env.VITE_API_URL}${product.images[0]}` : '/api/placeholder/400/300'}
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

      <div className="absolute top-4 right-4 flex gap-2">
        {/* Show edit and delete buttons only for user's own products */}
        {product.userEmail === localStorage.getItem('userEmail') && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/edit-product/${product._id}`);
              }}
              className={`bg-white text-gray-600 p-3 rounded-lg shadow-md
                transform transition-all duration-300
                ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
                hover:scale-110 active:scale-95`}
              title="Edit product"
            >
              <Edit className="w-5 h-5" />
            </button>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`bg-white text-red-500 p-3 rounded-lg shadow-md
                transform transition-all duration-300
                ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
                hover:scale-110 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Delete product"
            >
              {isDeleting ? (
                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="absolute bottom-4 left-4 right-4 bg-red-100 text-red-800 p-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default ProductCard;