const User = require('../models/user');
const mongoose = require('mongoose'); // Assuming you have a User model defined

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
    console.error('Error during signup:', error);
    res.status(500).json({ message: error });
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
    res.status(500).json({ message: 'Internal server error' });
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
    res.status(500).json({ message: 'Internal server error' });
  }
};