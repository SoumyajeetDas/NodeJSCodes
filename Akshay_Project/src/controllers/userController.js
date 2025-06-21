const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


exports.signup = async (req, res) => {
  try {
    // Extract user data from request body
    // const {firstName, lastName, emailId, password, age, gender } = req.body;

    const newUser = await User.create(req.body);

    // Remove password from the response for security reasons
    newUser.password = '';

    // Same thing could have been done using save()
    // const userData = {
    //   firstName: newUser.firstName,
    //   lastName: newUser.lastName,
    //   emailId: newUser.emailId,
    //   password: newUser.password,
    //   age: newUser.age,
    //   gender: newUser.gender,
    // }
    // const userData = await newUser.save();

    // Respond with the created user data
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    if (error?.name === 'ValidationError') {
      // Handle validation errors
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors: errorMessages });
    }
    console.error('Error during signup:', error);
    res.status(500).json({ message: error });
  }
};

exports.login = async (req, res) => {
  const { emailId, password } = req.body;

  try {

    // As in the User Model we kept password as selec: false, so by default it won't be returned in queries
    // +password is used to include the password field in the query result.
    const user = await User.findOne({ emailId }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = await jwt.sign({ _id: user._id }, 'DEVTINDER_SECRET');

    res.cookie('token', token);

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }

};

exports.user = async (req, res) => {
  const { emailId } = req.body;

  try {
    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Remove password from the response for security reasons
    user.password = '';

    res.status(200).json({ message: 'User found', user });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.users = async (req, res) => {
  try {
    const users = await User.find({});

    // It's all the same
    // const users = await User.find({});

    if (!users || users?.length === 0) {
      return res.status(400).json({ message: 'No users found' });
    }

    // Remove passwords from the response for security reasons
    users?.forEach(user => {
      user.password = '';
    });

    res.status(200).json({ message: 'Users fetched successfully', users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User found', user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.userDelete = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(new mongoose.Types.ObjectId(id));

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const user = await User.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, updateData, {
      new: true,
      // runValidators: true,
    });

    // const user = await User.findByIdAndUpdate(new mongoose.Types.ObjectId(id), updateData, {
    //   new: true,
    //   runValidators: true,
    // });

    // const user = await User.findByIdAndUpdate(new mongoose.Types.ObjectId(id), { $set: updateData }, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Remove password from the response for security reasons
    user.password = undefined;

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    if (error?.name === 'ValidationError') {
      // Handle validation errors
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors: errorMessages });
    }

    res.status(500).json({ message: error });
  }
};