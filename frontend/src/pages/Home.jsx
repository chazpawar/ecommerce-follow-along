import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-600">Home</Link>
              <Link to="/collection" className="text-gray-600">Collection</Link>
              <Link to="/cart" className="text-gray-600">Cart</Link>
              <Link to="/contact" className="text-gray-600">Contact</Link>
            </div>

            <div className="flex-1 flex justify-center">
              <Link to="/" className="text-3xl">
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
            </div>

            <div className="flex items-center space-x-8">
              <Link to="/shops" className="text-gray-600">Shops</Link>
              <Link to="/account" className="text-gray-600">Account</Link>
              <button className="text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img 
            src="https://www.home-designing.com/wp-content/uploads/2016/02/black-and-white-interior-design.jpg" 
            alt="Black and white interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        <div className="relative container mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <p className="text-lg mb-4">Furniture Home</p>
            <h1 className="text-6xl font-serif mb-8">Modern Interior Design</h1>
            <p className="text-xl mb-8">Transform your space with our curated collection of contemporary furniture</p>
            <button className="bg-white text-black px-8 py-4 rounded hover:bg-gray-100 transition-colors">
              Explore Collection
            </button>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif mb-6">What We Do</h2>
          <p className="text-lg mb-8">
            Our Focus: Crafting Inspiring Living Spaces. At Furniture Home, we're dedicated to turning ordinary spaces into visual masterpieces. With a passion for design, we collaborate closely with you to bring your unique vision to life. From color palettes to furniture arrangement, our decor experts ensure each corner tells a captivating story.
          </p>
          <button className="bg-black text-white px-8 py-4 rounded hover:bg-gray-800 transition-colors">
            Learn More
          </button>
        </div>
      </section>

      {/* Popular Collection */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-serif text-center mb-12">Popular Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="text-center col-span-4 text-gray-600">No products available</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/about">About</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/get-started">Get started</Link></li>
                <li><Link to="/learn">Learn</Link></li>
                <li><Link to="/case-studies">Case studies</Link></li>
                <li><Link to="/faqs">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Community</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/discord">Discord</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/blog">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Subscribe to our newsletter</h3>
              <p className="text-gray-600 mb-4">Join our community to get weekly updates and unique gifts every Friday</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 px-4 py-2 border rounded-l focus:outline-none"
                />
                <button className="bg-black text-white px-6 py-2 rounded-r">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
