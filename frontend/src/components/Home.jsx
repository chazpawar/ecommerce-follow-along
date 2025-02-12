import React from 'react';
import ProductCard from './ProductCard';

const sampleProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    image: 'https://via.placeholder.com/300x200?text=Headphones',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    image: 'https://via.placeholder.com/300x200?text=Smart+Watch',
  },
  {
    id: 3,
    name: 'Gaming Mouse',
    price: 49.99,
    image: 'https://via.placeholder.com/300x200?text=Gaming+Mouse',
  },
  {
    id: 4,
    name: 'Bluetooth Speaker',
    price: 79.99,
    image: 'https://via.placeholder.com/300x200?text=Speaker',
  },
  {
    id: 5,
    name: '4K Monitor',
    price: 299.99,
    image: 'https://via.placeholder.com/300x200?text=4K+Monitor',
  },
];

const Home = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
