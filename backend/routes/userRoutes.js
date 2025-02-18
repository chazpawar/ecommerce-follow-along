const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  registerUser,
  loginUser,
  getUser,
  updateProfilePicture,
  addAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/multer');

// Public routes
router.post('/signup', (req, res, next) => {
  upload.single('profilePicture')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer error occurred
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      // Unknown error occurred
      return res.status(500).json({
        success: false,
        message: 'Error uploading file'
      });
    }
    // No file or valid file, proceed with registration
    registerUser(req, res, next);
  });
});
router.post('/login', loginUser);

// Protected routes
router.get('/:id', protect, getUser);
router.put('/:id/profile-picture', protect, upload.single('profilePicture'), updateProfilePicture);

// Address routes
router.post('/:id/address', protect, addAddress);
router.put('/:id/address/:addressId', protect, updateAddress);
router.delete('/:id/address/:addressId', protect, deleteAddress);

module.exports = router;
