import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const popularProducts = [
    {
      id: 1,
      name: 'Flower Vase',
      price: 29.99,
      image: 'https://image.hm.com/assets/hm/0b/fc/0bfc00ddd054221ae07879781fefac599e3ecd8c.jpg?imwidth=1536'
    },
    {
      id: 2,
      name: 'Extra-large stoneware vase',
      price:  1899,
      image: 'https://image.hm.com/assets/hm/ed/a1/eda1aa8aff6a64d5bfe1e3fce2e013ab1629fa34.jpg?imwidth=1536'
    },
    {
      id: 3,
      name: 'Large irregular stoneware vase',
      price: 2699.00,
      image: 'https://image.hm.com/assets/hm/15/41/1541b49319ab2e4baec3e3776b2434d685928457.jpg?imwidth=1536'
    },
    {
      id: 4,
      name: 'Wooden frame',
      price: 1499.00,
      image: 'https://image.hm.com/assets/hm/72/76/727686df3964c65408746075c6a7f06450149d08.jpg?imwidth=1536'
    }
  ];

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

      {/* What We Do Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-4xl font-serif mb-8">What We Do</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Our Focus: Crafting Inspiring Living Spaces. At Furniture home, we're dedicated to turning ordinary spaces into visual masterpieces. With a passion for design, we collaborate closely with you to bring your unique vision to life. From color palettes to furniture arrangement, our decor experts ensure each corner tells a captivating story.
          </p>
          <button className="bg-black text-white px-6 py-3 rounded">Learn More</button>
        </div>
      </section>

      {/* Popular Collection */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-serif text-center mb-12">Popular Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularProducts.map((product) => (
              <div key={product.id} className="bg-white p-4">
                <img src={product.image} alt={product.name} className="w-full h-64 object-cover mb-4" />
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
              </div>
            ))}
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
              <p className="text-gray-600 mb-4">Join our community to get weekly updates and unique gifts every friday</p>
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