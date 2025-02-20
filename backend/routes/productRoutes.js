const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/Product');
const fs = require('fs').promises;
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const { protect } = require('../middleware/auth');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new ErrorResponse('Only .jpeg, .png, and .webp formats are allowed', 400), false);
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5
  }
});

// Validation middleware
const validateProduct = (req, res, next) => {
  const { name, description, price, category, userEmail } = req.body;

  if (!name || !description || !price || !category || !userEmail) {
    return next(new ErrorResponse('All fields are required', 400));
  }

  if (name.length < 3 || name.length > 100) {
    return next(new ErrorResponse('Product name must be between 3 and 100 characters', 400));
  }

  if (description.length < 10 || description.length > 1000) {
    return next(new ErrorResponse('Description must be between 10 and 1000 characters', 400));
  }

  const numPrice = parseFloat(price);
  if (isNaN(numPrice) || numPrice < 0) {
    return next(new ErrorResponse('Price must be a valid positive number', 400));
  }

  const validCategories = ['bedroom', 'livingroom', 'kitchen', 'bathroom'];
  if (!validCategories.includes(category)) {
    return next(new ErrorResponse('Invalid category', 400));
  }

  next();
};

// POST endpoint to create a new product
router.post('/create', protect, upload.array('images', 5), validateProduct, async (req, res, next) => {
  try {
    const { name, description, price, category, userEmail } = req.body;

    if (!req.files || req.files.length === 0) {
      return next(new ErrorResponse('At least one product image is required', 400));
    }

    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      images: imagePaths,
      userEmail
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });

  } catch (error) {
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path).catch(console.error);
      });
    }
    next(error);
  }
});

// PUT endpoint to update a product
router.put('/update/:id', protect, upload.array('images', 5), validateProduct, async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { name, description, price, category, userEmail } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Verify ownership
    if (product.userEmail !== userEmail) {
      return next(new ErrorResponse('Not authorized to update this product', 403));
    }

    // Handle new images if uploaded
    let imagePaths = product.images;
    if (req.files && req.files.length > 0) {
      // Delete old images
      await Promise.all(product.images.map(async (image) => {
        try {
          await fs.unlink(path.join(__dirname, '..', image));
        } catch (err) {
          console.warn(`Failed to delete old image: ${image}`, err);
        }
      }));

      // Set new images
      imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        price: parseFloat(price),
        category,
        images: imagePaths,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path).catch(console.error);
      });
    }
    next(error);
  }
});

// GET endpoint to fetch all products
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
});

// GET endpoint to fetch a single product
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
});

// DELETE endpoint to delete a product
router.delete('/delete/:id', protect, async (req, res, next) => {
  let imagesToDelete = [];
  
  try {
    const productId = req.params.id;
    const userEmail = req.body.userEmail;

    if (!productId || !userEmail) {
      return next(new ErrorResponse('Product ID and user email are required', 400));
    }

    const product = await Product.findById(productId);
    
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    if (product.userEmail !== userEmail) {
      return next(new ErrorResponse('Not authorized to delete this product', 403));
    }

    imagesToDelete = product.images ? 
      product.images.map(image => path.join(__dirname, '..', image)) : 
      [];

    await Product.findByIdAndDelete(productId);

    await Promise.all(imagesToDelete.map(async (fullPath) => {
      try {
        await fs.access(fullPath);
        await fs.unlink(fullPath);
      } catch (err) {
        console.warn(`Failed to delete image: ${fullPath}`, err);
      }
    }));

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      deletedProduct: {
        id: product._id,
        name: product.name
      }
    });

  } catch (error) {
    console.error('Error deleting product:', error);

    if (imagesToDelete.length > 0) {
      imagesToDelete.forEach(fullPath => {
        fs.unlink(fullPath).catch(err => 
          console.warn(`Failed to delete image during cleanup: ${fullPath}`, err)
        );
      });
    }
    next(error);
  }
});

module.exports = router;
