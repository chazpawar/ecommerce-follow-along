const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.config');
const userRoutes = require('./routes/userRoutes');
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

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
