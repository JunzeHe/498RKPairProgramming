// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var RoomSchema   = new mongoose.Schema({
  roomName: String
});

// Export the Mongoose model
module.exports = mongoose.model('Room', RoomSchema);
