var Message = require('../models/message');
var Room = require('../models/room');
var Edit = require('../models/edit');

module.exports = function(io){
  io.on('connection', function(socket){
    console.log("socket connected");
    var userName = "";
    var roomId = "";
    socket.on('store username and roomId', function(data){
      userName = data.username;
      roomId = data.roomId.toString();

      socket.join(roomId);
      io.to(roomId).emit('new user', userName);
    });

    socket.on('disconnect', function(){
      io.to(roomId).emit('user has left room', userName);
      Room.findByIdAndUpdate(roomId,
        {$pull: {"users":userName}},
        {new: true},
        function(err, newRoom){

        }
      );
    });

    socket.on('chat message', function(msg){
      var message = new Message(msg);
      message.save(function(err, createdMsg){
        if(err){
          console.log(err);
          socket.emit("response", {message: "There was an error", data: err});
        }
        else{
          socket.broadcast.to(roomId).emit('new chat message', {message: "Message stored", data: createdMsg});
        }
      });
    })

    socket.on('new edit', function(data){
      var edit = new Edit(data);
      edit.save(function(err, createdEdit){
        if(err)
          socket.emit('response', {message:"There was an error", data: err});
        else
          socket.broadcast.to(roomId).emit('new edit', {message:"Edit stored", data: createdEdit});
      });
    });
  });

}
