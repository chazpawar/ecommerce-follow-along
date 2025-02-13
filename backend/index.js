const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.config');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');  // Add this
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Connect to the database
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);  // Add this line for product routes

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
