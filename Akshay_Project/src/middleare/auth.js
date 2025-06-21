const jwt = require('jsonwebtoken');
const User = require('../models/user');
const mongoose = require('mongoose');

exports.userAuth = async (req, res, next) => {
  try {

    const cookies = req.cookies;

    const { token } = cookies;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decodedToken = await jwt.verify(token, 'DEVTINDER_SECRET');

    const { _id } = decodedToken;

    if (!_id) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const user = await User.findById(new mongoose.Types.ObjectId(_id));

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};