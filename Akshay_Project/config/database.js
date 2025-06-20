const mongoose = require('mongoose');

const connection = {};

const dbConnect = async () => {
  if (connection?.isConnected) {
    console.log('Already connected to DB');
    return;
  }

  // Connect to database
  const db = await mongoose.connect(
    'mongodb://0.0.0.0:27017' + '/devtinder' || '',
  );

  // 0 = disconnected
  // 1 = connected
  // 2 = connecting
  // 3 = disconnecting
  // 99 = uninitialized
  connection.isConnected = db.connections[0].readyState;

  console.log('Connected to DB');
};

module.exports = dbConnect;