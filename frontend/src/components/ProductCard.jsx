import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;

      card.style.transform = `perspective(1000px) rotateX(${offsetY / 20}deg) rotateY(${offsetX / 20}deg)`;
    };

    const handleMouseLeave = () => {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    const card = cardRef.current;
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleAddToCart = () => {
    alert(`${product.name} added to cart! 🛒`);
  };

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-lg shadow-2xl overflow-hidden transform transition-transform duration-300 hover:shadow-3xl"
    >
      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-lg font-medium mb-4">${product.price.toFixed(2)}</p>
        <div className="flex justify-between items-center space-x-4">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add to Cart
          </button>
          <Link
            to={`/product/${product.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
