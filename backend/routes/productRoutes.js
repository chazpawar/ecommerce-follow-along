const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// POST endpoint to create a new product with image upload
router.post('/create', upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, category, userEmail } = req.body;

    if (!name || !description || !price || !category || !userEmail) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Get file paths for uploaded images
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      images: imagePaths,
      userEmail,  // Add the userEmail field to associate the product with a user
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error.message === 'Only image files are allowed!') {
      return res.status(400).json({ message: error.message });
    }
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
    }
    
    res.status(500).json({
      message: 'Failed to create product. Please try again.',
      error: error.message
    });
  }
});

// GET endpoint to fetch a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product details' });
  }
});

// GET endpoint to fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// GET endpoint to fetch products by user email
router.get('/my-products/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const userProducts = await Product.find({ userEmail });

    if (userProducts.length === 0) {
      return res.status(404).json({ message: 'No products found for this user.' });
    }

    res.status(200).json(userProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT endpoint to update a product
router.put('/update/:id', upload.array('images', 5), async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, category } = req.body;
    
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const updateData = {
      name,
      description,
      price,
      category
    };

    // If new images are uploaded, update the images array
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
      updateData.images = imagePaths;

      // Get the existing product to delete old images
      const existingProduct = await Product.findById(productId);
      if (existingProduct && existingProduct.images) {
        // Delete old image files
        existingProduct.images.forEach(imagePath => {
          const fullPath = path.join(__dirname, '..', imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      message: 'Failed to update product',
      error: error.message
    });
  }
});

// DELETE endpoint to delete a product by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product first to get image paths
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ensure the user owns this product
    if (product.userEmail !== req.body.userEmail) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    // Delete associated image files
    if (product.images && product.images.length > 0) {
      product.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    // Delete the product from database
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
