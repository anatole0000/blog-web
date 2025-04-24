const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password });
    await user.save();
    req.session.userId = user._id; // Store user ID in session
    res.status(201).send('User registered');
  } catch (err) {
    res.status(400).send('Error registering user');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('User not found');
  
  const match = await user.comparePassword(password);
  if (!match) return res.status(400).send('Invalid password');
  
  req.session.userId = user._id; // Store user ID in session
  res.status(200).send('Logged in');
});

// Check session
router.get('/check', (req, res) => {
    if (req.session.userId) {
      res.json({ loggedIn: true });
    } else {
      res.json({ loggedIn: false });
    }
});
  
  // Logout
  router.post('/logout', (req, res) => {
    req.session = null;
    res.sendStatus(200);
});
  

module.exports = router;
