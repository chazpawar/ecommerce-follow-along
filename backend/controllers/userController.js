const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register user
// @route   POST /api/users/signup
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    console.log('Register request body:', req.body);
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check email format
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check password strength
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLongEnough = password.length >= 8;

    console.log('Password validation:', {
      password,
      hasLower,
      hasUpper,
      hasNumber,
      isLongEnough
    });

    if (!hasLower || !hasUpper || !hasNumber || !isLongEnough) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
        validations: {
          hasLower,
          hasUpper,
          hasNumber,
          isLongEnough
        }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user (password hashing is handled by the User model pre-save middleware)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password
    });

    // Get public profile without sensitive information
    const userResponse = user.getPublicProfile();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    // Find user by email and explicitly include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    // Check if user exists
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Compare password using the method defined in the User model
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Get public profile without sensitive information
    const userResponse = user.getPublicProfile();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: userResponse
    });

  } catch (error) {
    next(new ErrorResponse('Error during login', 500));
  }
};

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Get public profile without sensitive information
    const userResponse = user.getPublicProfile();

    res.status(200).json({
      success: true,
      data: userResponse
    });

  } catch (error) {
    next(new ErrorResponse('Error fetching user profile', 500));
  }
};

// @desc    Update user profile picture
// @route   PUT /api/users/:id/profile-picture
// @access  Private
const updateProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload an image file', 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();

    // Get public profile without sensitive information
    const userResponse = user.getPublicProfile();

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      data: userResponse
    });

  } catch (error) {
    next(new ErrorResponse('Error updating profile picture', 500));
  }
};

// @desc    Add user address
// @route   POST /api/users/:id/address
// @access  Private
const addAddress = async (req, res, next) => {
  try {
    const { street, city, state, zipCode, country } = req.body;

    // Validate input
    if (!street || !city || !state || !zipCode || !country) {
      return next(new ErrorResponse('Please provide all address fields', 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // If this is the first address, make it default
    const isDefault = user.addresses.length === 0;

    user.addresses.push({
      street,
      city,
      state,
      zipCode,
      country,
      isDefault
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: user.getPublicProfile()
    });

  } catch (error) {
    next(new ErrorResponse('Error adding address', 500));
  }
};

// @desc    Update user address
// @route   PUT /api/users/:id/address/:addressId
// @access  Private
const updateAddress = async (req, res, next) => {
  try {
    const { street, city, state, zipCode, country, isDefault } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    const address = user.addresses.id(req.params.addressId);
    if (!address) {
      return next(new ErrorResponse('Address not found', 404));
    }

    // Update address fields
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (zipCode) address.zipCode = zipCode;
    if (country) address.country = country;
    
    // Handle default address
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = addr._id.equals(address._id);
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: user.getPublicProfile()
    });

  } catch (error) {
    next(new ErrorResponse('Error updating address', 500));
  }
};

// @desc    Delete user address
// @route   DELETE /api/users/:id/address/:addressId
// @access  Private
const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    const address = user.addresses.id(req.params.addressId);
    if (!address) {
      return next(new ErrorResponse('Address not found', 404));
    }

    // If deleting default address, make another address default if exists
    if (address.isDefault && user.addresses.length > 1) {
      const newDefaultAddress = user.addresses.find(addr => !addr._id.equals(address._id));
      if (newDefaultAddress) {
        newDefaultAddress.isDefault = true;
      }
    }

    address.remove();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      data: user.getPublicProfile()
    });

  } catch (error) {
    next(new ErrorResponse('Error deleting address', 500));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateProfilePicture,
  addAddress,
  updateAddress,
  deleteAddress
};
