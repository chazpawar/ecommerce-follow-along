import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const cardRef = useRef(null);

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
      }
    };

    const card = cardRef.current;
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Link
      to={`/product/${product.id}`}
      ref={cardRef}
      className="block bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative">
        <img
          src={product.images ? product.images[0] : '/api/placeholder/400/300'}
          alt={product.name || 'Product'}
          className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        {product.rating && (
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium text-yellow-500">
            ⭐ {product.rating}
          </div>
        )}
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {product.name || 'Unnamed Product'}
          </h3>
          <p className="text-gray-600 font-medium mt-1">
            ${product.price ? product.price.toFixed(2) : '0.00'}
          </p>
        </div>
        
        <div className="w-full bg-black text-white py-2 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-800 text-center">
          View Details
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;