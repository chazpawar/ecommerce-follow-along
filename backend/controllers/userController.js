const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register User
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const loginUser = async (req, res) => {
  // Placeholder for the login functionality
};

const getUser = async (req, res) => {
  // Placeholder for the getUser functionality
};

module.exports = { registerUser, loginUser, getUser };
