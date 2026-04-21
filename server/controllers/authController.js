const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  const { name, email, password, college, year, department, phone } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  const user = await User.create({ name, email, password, college, year, department, phone });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    college: user.college,
    year: user.year,
    token: generateToken(user._id),
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' });
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    college: user.college,
    year: user.year,
    token: generateToken(user._id),
  });
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};
