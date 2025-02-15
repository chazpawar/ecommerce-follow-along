const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return next(new ErrorResponse('Please provide all required fields', 400));
    }

    // Check email format
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return next(new ErrorResponse('Please provide a valid email address', 400));
    }

    // Check password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return next(new ErrorResponse(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
        400
      ));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(new ErrorResponse('User already exists with this email', 400));
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
    next(new ErrorResponse('Error registering user', 500));
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

module.exports = { 
  registerUser, 
  loginUser, 
  getUser,
  updateProfilePicture 
};
