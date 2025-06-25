const ConnectionRequest = require('../models/ConnectionRequest');
const mongoose = require('mongoose');
const User = require('../models/User');

// User can send connection request to another user
exports.send = async (req, res) => {

  try {

    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatuses = ['ignored', 'interested'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status can only be ignored and interested' });
    }

    // Check if the toUserId ever exists in the database
    const toUserExists = await User.findById(new mongoose.Types.ObjectId(toUserId));

    if (!toUserExists) {
      return res.status(400).json({ message: 'To User does not exist' });
    }

    // This way to check the duplicate connection request from a user to another user.
    // Also it checks say if User1 has sent connection request to User2, then User2
    // cannot send connection request to User1.
    const isDupConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: new mongoose.Types.ObjectId(fromUserId), toUserId: new mongoose.Types.ObjectId(toUserId) },
        { fromUserId: new mongoose.Types.ObjectId(toUserId), toUserId: new mongoose.Types.ObjectId(fromUserId) },
      ],
    });

    if (isDupConnectionRequest) {
      return res.status(400).json({ message: 'Connection request already exists' });
    }

    // const connectionRequest = await ConnectionRequest.create({
    //   fromUserId,
    //   toUserId,
    //   status,
    // });

    const connectionRequest = new ConnectionRequest({
      fromUserId: new mongoose.Types.ObjectId(fromUserId),
      toUserId: new mongoose.Types.ObjectId(toUserId),
      status,
    });

    const newConnectionRequest = await connectionRequest.save();

    if (!newConnectionRequest) {
      return res.status(400).json({ message: 'Connection request not created' });
    }

    return res.status(200).json({ message: 'Connection request created successfully', connectionRequest });
  } catch (error) {
    console.error('Error creating connection request:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

// Review will be done by the user who got the connection request, means the toUserId and not fromUserId
exports.review = async (req, res) => {
  const user = req.user;

  try {
    const allowedStatuses = ['accepted', 'rejected'];

    const status = req.params.status;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status can only be accepted or rejected' });
    }

    const requestId = req.params.requestId;

    // Query if the particular request Id where the user to who the connection request is sent
    // is passed or not. If the sender sends  interested in the request then only the receiver can review it.
    const connectionRequst = await ConnectionRequest.findOne({
      _id: new mongoose.Types.ObjectId(requestId),
      toUserId: user._id,
      status: 'interested',
    });

    if (!connectionRequst) {
      return res.status(400).json({ message: 'Connection request not found or not interested' });
    }

    // Depending on the status the final status will be set
    connectionRequst.status = status;

    const updatedConnectionRequest = await connectionRequst.save();

    if (!updatedConnectionRequest) {
      return res.status(400).json({ message: 'Connection request not updated' });
    }

    return res.status(200).json({
      message: 'Connection request reviewed successfully',
      connectionRequest: updatedConnectionRequest,
    });
  } catch (error) {
    console.error('Error reviewing connection requests:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};