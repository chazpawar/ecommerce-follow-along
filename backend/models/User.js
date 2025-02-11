const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String, // Will store the file path of the uploaded image
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
