import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();

  // Mock product details for now (replace with real data later)
  const product = {
    id,
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation.',
    price: 99.99,
    image: 'https://via.placeholder.com/600x400?text=Product+Image',
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover mb-4" />
      <p className="text-gray-700 mb-4">{product.description}</p>
      <p className="text-xl font-semibold">Price: ${product.price.toFixed(2)}</p>
      <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;
