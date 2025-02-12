import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const handleAddToCart = () => {
    alert(`${product.name} added to cart! 🛒`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handleAddToCart}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add to Cart
          </button>
          <Link to={`/product/${product.id}`} className="text-blue-500 hover:underline">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
