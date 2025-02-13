import React, { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  const cardRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;

      card.style.transform = `perspective(1000px) rotateX(${offsetY / 30}deg) rotateY(${offsetX / 30}deg)`;
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

  const product = {
    id,
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and up to 20 hours of battery life.',
    price: 99.99,
    image: '/api/placeholder/600/400', // Replace with your actual image source
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div
          ref={cardRef}
          className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-4xl mx-auto transform transition-transform duration-300 ease-out"
        >
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-8 md:w-1/2">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg mb-6">{product.description}</p>
              <p className="text-2xl font-semibold text-gray-800 mb-6">
                ${product.price.toFixed(2)}
              </p>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
