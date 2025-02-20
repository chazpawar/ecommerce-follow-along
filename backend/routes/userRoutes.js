const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Auth routes
router.post('/signup', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/:id', protect, getUser);

module.exports = router;
