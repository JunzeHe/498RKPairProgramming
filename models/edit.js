// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var EditSchema   = new mongoose.Schema({
  dateCreated: Date,
  userName: String,
  roomName: String,
  roomId: {
    type: String,
    index: true
  },
  edit: String,
  changeObj: Object
});

// Export the Mongoose model
module.exports = mongoose.model('Edit', EditSchema);
