// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var UserSchema   = new mongoose.Schema({
  name: String,
  roomName: String,
  roomId: {
    type: Number,
    index: true}
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
