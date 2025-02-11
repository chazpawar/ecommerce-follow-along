const express = require('express');
const router = express.Router();
const { registerUser, getUser } = require('../controllers/userController');
const upload = require('../middleware/multer');

router.post('/register', upload.single('profilePicture'), registerUser);
router.get('/:id', getUser);

module.exports = router;
