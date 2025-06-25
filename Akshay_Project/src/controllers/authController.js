const User = require('../models/user');


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

    const token = await user.getJWT();

    res.cookie('token', token);

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }

};

exports.logout = async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
  }).status(200).json({ message: 'Logout successful' });
};

exports.resetPassword = async (req, res) => {
  const { emailId, oldPassword, newPassword } = req.body;

  if (!emailId || !oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Please provide emailId, oldPassword, and newPassword' });
  }

  try {

    const user = await User.findOne({ emailId }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Password is not valid' });
    }

    user.password = newPassword;


    // This will automatically hash the new password before saving, due to the pre-save hook in the User model
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }

};