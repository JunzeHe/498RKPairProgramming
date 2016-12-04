
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
  });

}
