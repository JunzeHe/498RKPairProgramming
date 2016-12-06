var Message = require('../models/message');
var Room = require('../models/room');
var Edit = require('../models/edit');

module.exports = function(io){
  io.on('connection', function(socket){
    console.log("socket connected");

    socket.on('message', function(msg){
      console.log("Message received: " + msg);
    });

    socket.on('literally any event name', function(val){
      console.log("Message also received: " + val);
      io.emit('kickass mindwashing emission', "You have been acknowledged");
    });

    socket.on('chat message', function(msg){
      console.log("Chat message received");

      var message = new Message(msg);
      message.save(function(err, createdMsg){
        if(err)
          io.emit("response", {message: "There was an error", data: err});
        else
          io.emit('response', {message: "Message stored", data: createdMsg});
      });
    })

    socket.on('new edit', function(data){
      var edit = new Edit(data);
      edit.save(function(err, createdEdit){
        if(err)
          io.emit('response', {message:"There was an error", data: err});
        else
          io.emit('response', {message:"Edit stored", data: createdEdit});
      });
    });

    var userName = "";
    var roomId = "";
    socket.on('store username and roomId', function(data){
      userName = data.username;
      roomId = data.roomId

      io.emit('new user', userName);
    });

    socket.on('disconnect', function(){
      io.emit('user has left room', userName);
      Room.findByIdAndUpdate(roomId,
        {$pull: {"users":userName}},
        {new: true},
        function(err, newRoom){

        }
      );
    });
  });

}
