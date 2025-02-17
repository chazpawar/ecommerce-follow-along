const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart
} = require('../controllers/cartController');

// Protect all cart routes - require authentication
router.use(protect);

// Get cart items
router.get('/', getCart);

// Add to cart
router.post('/add', addToCart);

// Update cart item quantity
router.put('/:productId', updateCartItem);

// Remove item from cart
router.delete('/:productId', removeFromCart);

module.exports = router;