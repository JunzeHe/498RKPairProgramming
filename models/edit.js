// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var EditSchema   = new mongoose.Schema({
  dateCreated: Date,
  userName: String,
  roomName: String,
  roomId: {
    type: Number,
    index: true
  },
  edit: String
});

// Export the Mongoose model
module.exports = mongoose.model('Edit', EditSchema);
