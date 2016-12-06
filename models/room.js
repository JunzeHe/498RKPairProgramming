// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var RoomSchema   = new mongoose.Schema({
  roomName: String,
  users: [String]
});

// Export the Mongoose model
module.exports = mongoose.model('Room', RoomSchema);
