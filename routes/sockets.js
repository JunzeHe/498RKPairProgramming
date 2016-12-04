
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
      io.emit('response', 'Message received: ' + msg);
    });

    var numEdit = 0;
    socket.on('new edit', function(event){
      numEdit += 1;
      console.log("new edit received");
      io.emit('response', 'Edit ' + numEdit.toString() + ' stored.');
    });
  });

}
