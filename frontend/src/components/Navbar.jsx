import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingCart, LogIn, User, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const userEmail = localStorage.getItem('userEmail');

  const NavLink = ({ to, icon: Icon, text }) => {
    const linkVariants = {
      initial: { 
        backgroundColor: 'rgba(255, 255, 255, 0)',
        color: 'white',
        scale: 1
      },
      hover: { 
        backgroundColor: 'rgba(255, 255, 255, 1)',
        color: 'black',
        scale: 1.05,
        transition: { 
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
          scale: {
            type: "spring",
            stiffness: 400,
            damping: 25
          }
        }
      }
    };

    return (
      <motion.div
        initial="initial"
        whileHover="hover"
        variants={linkVariants}
        className="rounded-lg"
      >
        <Link
          to={to}
          className="flex items-center gap-2 text-sm px-4 py-2 no-underline focus:outline-none"
        >
          <Icon size={20} />
          {text}
        </Link>
      </motion.div>
    );
  };

  const headerVariants = {
    initial: { y: -100 },
    animate: { 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <motion.header
      initial="initial"
      animate="animate"
      variants={headerVariants}
      className="fixed top-0 left-0 w-full bg-black z-50 py-8"
      style={{ willChange: 'transform' }}
    >
      <div className="max-w-[1100px] h-full mx-auto flex items-center justify-center">
        <nav className="flex items-center gap-8 w-full justify-center">
          <NavLink to="/" icon={Home} text="HOME" />
          <NavLink to="/cart" icon={ShoppingCart} text="CART" />
          {userEmail ? (
            <>
              <NavLink to="/my-products" icon={User} text="MY PRODUCTS" />
              <NavLink to="/create-product" icon={Plus} text="Create-Product" />
            </>
          ) : (
            <NavLink to="/login" icon={LogIn} text="LOGIN" />
          )}
        </nav>
      </div>
    </motion.header>
  );
};

export default Navbar;