const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
  emailId: {
    type: String,
    required: [true, 'Email ID is required'],
    unique: true,
    validate: {
      validator: function(val) {
        let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return validRegex.test(val);
      },
      message: 'Invalid email address',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // Do not return password in queries
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'You must be at least 18 years old'],
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['male', 'female'],
      message: '{VALUE} is not supported',
    },
  },
});

// Pre-save hook to hash the password before saving -- Document Middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    // Here you can hash the password before saving it
    // For example, using bcrypt:
    // const bcrypt = require('bcrypt');
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

// If the model already exists, use it; otherwise, create a new one
let userModel = (mongoose.models.User) || (mongoose.model('User', userSchema));

module.exports = userModel;