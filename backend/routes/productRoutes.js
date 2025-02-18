const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/Product');
const fs = require('fs').promises;  // Using promises version for better async handling
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
      cb(new Error('Only .jpeg, .png, and .webp formats are allowed'), false);
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
    return res.status(400).json({ 
      success: false,
      message: 'All fields are required' 
    });
  }

  if (name.length < 3 || name.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Product name must be between 3 and 100 characters'
    });
  }

  if (description.length < 10 || description.length > 1000) {
    return res.status(400).json({
      success: false,
      message: 'Description must be between 10 and 1000 characters'
    });
  }

  const numPrice = parseFloat(price);
  if (isNaN(numPrice) || numPrice < 0) {
    return res.status(400).json({
      success: false,
      message: 'Price must be a valid positive number'
    });
  }

  const validCategories = ['bedroom', 'livingroom', 'kitchen', 'bathroom'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category'
    });
  }

  next();
};

// POST endpoint to create a new product
router.post('/create', protect, upload.array('images', 5), validateProduct, async (req, res) => {
  try {
    const { name, description, price, category, userEmail } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one product image is required'
      });
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

    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
});

// PUT endpoint to update a product
router.put('/update/:id', protect, upload.array('images', 5), validateProduct, async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, category, userEmail } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Verify ownership
    if (product.userEmail !== userEmail) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    // Handle new images if uploaded
    let imagePaths = product.images; // Keep existing images by default
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

    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
});

// GET endpoint to fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// GET endpoint to fetch a single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// DELETE endpoint to delete a product
router.delete('/delete/:id', protect, async (req, res) => {
  let imagesToDelete = [];
  
  try {
    const productId = req.params.id;
    const userEmail = req.body.userEmail;

    if (!productId || !userEmail) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and user email are required'
      });
    }

    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.userEmail !== userEmail) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
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

    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
});

module.exports = router;
