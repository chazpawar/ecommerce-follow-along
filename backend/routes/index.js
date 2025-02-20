const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');

// Log requests in development
if (process.env.NODE_ENV !== 'production') {
  router.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    if (req.body && Object.keys(req.body).length) {
      console.log('Request body:', req.body);
    }
    next();
  });
}

// Mount routes
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);

module.exports = router;