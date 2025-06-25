const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'From User ID is required'],
    ref: 'User',
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'To User ID is required'],
  },
  status: {
    type: String,
    enum: {
      values: ['ignored', 'interested', 'accepted', 'rejected'],
      message: '{VALUE} is not a valid status',
    },
  },
}, {
  timestamps: true,
});


// Indexing the schema for faster queries. This will automatically make the combination unique
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });


// Pre-save hook / middleware to check for self-connection requests
connectionRequestSchema.pre('save', async function(next) {
  if (this.fromUserId?.toString() === this.toUserId?.toString()) {
    throw new Error('You cannot send a connection request to yourself');
  }

  next();
});

let connectionRequestModel = (mongoose.models.ConnectionRequest) || mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = connectionRequestModel;