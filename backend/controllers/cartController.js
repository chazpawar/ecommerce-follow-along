const User = require('../models/User');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Add product to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Check if product is available and has enough stock
    if (!product.checkAvailability(quantity)) {
      return next(new ErrorResponse('Product is out of stock or insufficient quantity', 400));
    }

    // Find user and update their cart
    const user = await User.findById(req.user.id);
    
    // Check if product already exists in cart
    const existingCartItem = user.cart.find(
      item => item.product.toString() === productId
    );

    if (existingCartItem) {
      // Update quantity if product already in cart
      existingCartItem.quantity += quantity;
    } else {
      // Add new product to cart
      user.cart.push({
        product: productId,
        quantity
      });
    }

    await user.save();

    // Populate product details in response
    await user.populate('cart.product');

    res.status(200).json({
      success: true,
      data: user.cart
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get cart items
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    
    res.status(200).json({
      success: true,
      data: user.cart
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Check stock availability
    if (!product.checkAvailability(quantity)) {
      return next(new ErrorResponse('Insufficient stock', 400));
    }

    const user = await User.findById(req.user.id);
    const cartItem = user.cart.find(item => item.product.toString() === productId);

    if (!cartItem) {
      return next(new ErrorResponse('Product not found in cart', 404));
    }

    cartItem.quantity = quantity;
    await user.save();
    await user.populate('cart.product');

    res.status(200).json({
      success: true,
      data: user.cart
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(
      item => item.product.toString() !== req.params.productId
    );
    
    await user.save();

    res.status(200).json({
      success: true,
      data: user.cart
    });

  } catch (error) {
    next(error);
  }
};