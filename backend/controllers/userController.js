const User = require('../models/User');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const profilePicture = req.file ? req.file.path : ""; // Get the uploaded file path

    const user = new User({ name, email, password, profilePicture });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Error registering user", details: error.message });
  }
};

// Get user details
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user", details: error.message });
  }
};

module.exports = { registerUser, getUser };
