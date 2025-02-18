const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db.config');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
require('dotenv').config();

const app = express();

// CORS configuration for development
app.use(cors());

// Log incoming requests in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Increase payload size limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Connect to the database
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    port: currentPort,
    environment: process.env.NODE_ENV
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

const PORT = parseInt(process.env.PORT) || 7000;
let currentPort = PORT;

// Function to find an available port
const findAvailablePort = async (startPort) => {
  const net = require('net');
  
    const tryPort = (port) => {
      // Ensure port stays within valid range
      if (port >= 65536) {
        throw new Error('No available ports found in valid range');
      }
  
      return new Promise((resolve, reject) => {
        const server = net.createServer();
        
        server.once('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            server.close(() => resolve(tryPort(parseInt(port) + 1)));
          } else {
            reject(err);
          }
        });
        
        server.once('listening', () => {
          const usedPort = server.address().port;
          server.close(() => resolve(usedPort));
        });
        
        server.listen(parseInt(port), '0.0.0.0');
      });
    };
    
    try {
      return await tryPort(parseInt(startPort));
    } catch (err) {
      console.error('Error finding available port:', err);
      throw err;
    }
};

// Start the server with port finding
const startServer = async () => {
  try {
    const availablePort = await findAvailablePort(PORT);
    currentPort = availablePort;

    const server = app.listen(availablePort, '0.0.0.0', () => {
      console.log(`Server is running on port ${availablePort}`);
      if (availablePort !== PORT) {
        console.log(`Note: Original port ${PORT} was in use, using ${availablePort} instead`);
        console.log(`Update your frontend API URL to: http://localhost:${availablePort}`);
      }
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${availablePort} is in use, trying another port...`);
        server.close();
        startServer();
      } else {
        console.error('Server error:', err);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    if (error.code === 'EADDRINUSE') {
      console.log('Retrying with next available port...');
      startServer();
    } else {
      process.exit(1);
    }
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Handle server errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

startServer();
