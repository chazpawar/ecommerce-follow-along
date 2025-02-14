const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db.config');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');  // Add this
require('dotenv').config();

const app = express();

// Middleware
// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Connect to the database
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);  // Add this line for product routes

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
