import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const slides = [
  {
    image: "https://www.home-designing.com/wp-content/uploads/2020/09/black-and-white-living-room.jpg",
  },
  {
    image: "https://www.home-designing.com/wp-content/uploads/2020/09/open-plan-living-room-with-kitchen-island.jpg",
  },
  {
    image: "https://www.home-designing.com/wp-content/uploads/2020/09/marble-coffee-table.jpg",
  },
  {
    image: "https://www.home-designing.com/wp-content/uploads/2020/09/black-and-white-kitchens.jpg",
  },
  {
    image: "https://www.home-designing.com/wp-content/uploads/2020/09/light-grey-modern-sofa-600x400.jpg",
  }
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('latest'); // latest, price-low-high, price-high-low
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto-sliding effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      
      if (response.data.success) {
        let sortedProducts = [...response.data.products];
        
        // Apply sorting
        switch(sort) {
          case 'price-low-high':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-high-low':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
          default: // latest
            sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        setProducts(sortedProducts);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    let sortedProducts = [...products];
    
    switch(newSort) {
      case 'price-low-high':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default: // latest
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setProducts(sortedProducts);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">

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

      {/* Hero Section with Slider */}
      <section className="relative h-screen">
        <div className="absolute inset-0 overflow-hidden">
          {slides.map((slide, index) => (
            <img 
              key={index}
              src={slide.image} 
              alt={`Slide ${index + 1}`} 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
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
        
        {/* Slider Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
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
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-serif">Popular Collection</h2>
            <div className="flex items-center space-x-4">
              <label htmlFor="sort" className="text-gray-600">Sort by:</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="latest">Latest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-black border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">
              <p>{error}</p>
              <button 
                onClick={fetchProducts}
                className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <p className="text-center col-span-4 text-gray-600">No products available</p>
              )}
            </div>
          )}
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
