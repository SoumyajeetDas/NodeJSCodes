const ConnectionRequest = require('../models/connectionRequest');
exports.requestsReceived = async (req, res) => {
  const user = req.user;

  try {

    const requests = await ConnectionRequest.find({
      toUserId: user._id,
      status: 'interested',
    })
      .populate({
        path: 'fromUserId',
        select: ['firstName', 'lastName', 'emailId', 'profilePicture'], // Select only the fields you need
      });
    // .populate({
    //   path: 'fromUserId',
    //   select: 'firstName lastName emailId', // Select only the fields you need
    // });
    // .populate('fromUserId', 'firstName  lastName emailId'); // Populate fromUserId with name, email, and profilePicture
    //.populate('fromUserId', ['firstName', 'lastName', 'emailId']); // Populate fromUserId with name, email, and profilePicture

    if (!requests || requests.length === 0) {
      return res.status(200).json({ message: 'No connection requests found', requests });
    }

    return res.status(200).json({
      message: 'Connection requests found',
      requests,
    });
  } catch (error) {
    console.error('Error fetching connection requests:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }

};

exports.connections = async (req, res) => {
  const user = req.user;

  try {
    //////// 1st Way//////////
    // const connections = await ConnectionRequest.find({
    //   $or: [{
    //     $and: [
    //       { fromUserId: user._id },
    //       { status: 'accepted' },
    //     ],
    //
    //   }, {
    //     $and: [
    //       { toUserId: user._id },
    //       { status: 'accepted' },
    //     ],
    //   }],
    // });


    //////// 2nd Way//////////
    const connections = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: user._id,
          status: 'accepted',
        },
        {
          toUserId: user._id,
          status: 'accepted',
        },
      ],
    })
      .populate('fromUserId', ['firstName', 'lastName', 'emailId']); // Populate fromUserId with name, email, and profilePicture


    // Suppose User1 logs in, then we will figure out the connections where User1 has sent request to User2(present in fromUserId user who logged in
    // his/her ObjectId will be present) and User2 has accepted the request  or User2 has sent request to
    // User1 (present in toUserId user who logged in his/her ObjectId will be present) and User1 has accepted
    // the request
    const connectionsWithToUser = connections.map(connection => {
      if (connection.fromUserId.toString() === user._id.toString()) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    if (!connectionsWithToUser || connectionsWithToUser.length === 0) {
      return res.status(200).json({ message: 'No connections found', connections: [] });
    }

    return res.status(200).json({
      message: 'Connections found',
      connections: connectionsWithToUser,
    });
  } catch (error) {
    console.error('Error fetching connections:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};