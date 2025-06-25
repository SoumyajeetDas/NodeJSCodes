const User = require('../models/User');

const { validateEditProfileData } = require('../utils/validation');
exports.profileView = async (req, res) => {
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

exports.profileEdit = async (req, res) => {

  try {

    const user = req.user;

    const updatedData = req.body;

    const isEditAllowed = validateEditProfileData(updatedData);

    if (!isEditAllowed) {
      return res.status(400).json({ message: 'Invalid data provided for profile edit' });
    }

    // This is one way to update the user profile
    // await User.findByIdAndUpdate(user._id, updatedData, {
    //   new: true,
    //   runValidators: true,
    // });


    // This is Akshay's way to update the user profile
    Object.keys(updatedData).forEach(key => {
      user[key] = updatedData[key];
    });

    // Validation happpens with save() method
    await user.save();

    return res.status(200).json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Error updating profile:', error);

    if (error?.name === 'ValidationError') {
      // Handle validation errors
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors: errorMessages });
    }

    return res.status(500).json({ message: 'Internal server error', error });
  }
};

