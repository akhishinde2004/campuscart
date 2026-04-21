const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// Update own profile
router.put('/profile', protect, async (req, res) => {
  const { name, phone, department, year } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, department, year },
    { new: true }
  ).select('-password');
  res.json(user);
});

// Get public profile by ID
router.get('/profile/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -email');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

module.exports = router;
