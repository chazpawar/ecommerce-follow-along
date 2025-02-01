const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000; 

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Backend server is running! monkey ");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});