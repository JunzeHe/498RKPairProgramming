// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var MessageSchema   = new mongoose.Schema({
  userId: Number,
  userName: String,
  roomName: String,
  roomId: {
    type: Number,
    index: true
  },
  message: String
});

// Export the Mongoose model
module.exports = mongoose.model('Message', MessageSchema);
