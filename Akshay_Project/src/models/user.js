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
    trim: true,
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
  photoUrl: {
    type: String,
    default: 'https://t4.ftcdn.net/jpg/02/44/43/69/360_F_244436923_vkMe10KKKiw5bjhZeRDT05moxWcPpdmb.jpg',
  },
  about: {
    type: String,
    default: 'This default about section will be updated soon.',
    maxlength: [500, 'About section cannot exceed 500 characters'],
  },
  skills: {
    type: [String],
  },
}, {
  timestamps: true,
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

// Instance method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Compare the candidate password with the hashed password
  return await bcrypt.compare(candidatePassword, this.password);
};

// If the model already exists, use it; otherwise, create a new one
let userModel = (mongoose.models.User) || (mongoose.model('User', userSchema));

module.exports = userModel;