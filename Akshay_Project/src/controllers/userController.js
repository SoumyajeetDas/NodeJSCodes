const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const { connection } = require('mongoose');

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
      .populate('fromUserId', ['firstName', 'lastName', 'emailId']) // Populate fromUserId with name, email, and profilePicture
      .populate('toUserId', ['firstName', 'lastName', 'emailId']); // Populate toUserId with name, email, and profilePicture


    // Suppose User1 logs in, then we will figure out the connections where User1(fromUserId) has sent request to User2
    // and User2 has accepted the request or User2 has sent request to  User1 (present in toUserId user) and User1 has accepted
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

exports.feed = async (req, res) => {
  const user = req.user;

  const page = parseInt(req.query.page) || 1; // Get the page number from query params, default to 1
  let limit = parseInt(req.query.limit) || 10;

  // Kppe a filter otherwise the DB query will be high
  limit = limit > 50 ? 50 : limit; // Limit the number of results to a maximum of 50

  try {
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: user._id },
        { toUserId: user._id },
      ],
    }).select('fromUserId toUserId'); // Select only the fields you need

    const hideUsersFromFeed = new Set();

    connectionRequests.map(connection => {
      hideUsersFromFeed.add(connection.fromUserId);
      hideUsersFromFeed.add(connection.toUserId);
    });

    const feed = await User.find({
      _id: { $nin: [user._id, ...Array.from(hideUsersFromFeed)] }, // Exclude users in hideUsersFromFeed
    })
      .select('firstName lastName emailId photoUrl about skills') // Select only the fields you need
      .skip((page - 1) * limit).limit(limit); // Pagination logic, assuming page is passed in query params

    if (!feed || feed?.length === 0) {
      return res.status(200).json({ message: 'No feed found', feed: [] });
    }

    return res.status(200).json({
      message: 'Feed found',
      feed,
    });
  } catch (error) {
    console.error('Error fetching feed:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};