var Room = require('../models/room');

module.exports = function(router) {
  var createRoomRoute = router.route('/api/room/:roomId?');

  createRoomRoute.post(function(req,res){
    if(!req.params.roomId){
      if('roomName' in req.body && req.body['roomName'].length > 0){
        var roomName = req.body['roomName'];
        var room = new Room({roomName: roomName, users: []});

        if('userName' in req.body && req.body['userName'].length > 0)
          room.users.push(req.body['userName']);

        room.save(function(err, createdRoom){
          if(err)
            res.json({message: "There was an error", data: err});
          else
            res.json({message: "Room Created", data: createdRoom});
        });
      }
    }
    else{
    //Player 1 has entered the game
      Room.findByIdAndUpdate(
        req.params.roomId,
        {$push: {"users": req.body.userName}},
        {new: true},
        function(err, newRoom){
          if(err)
            res.status(404).json({message: "Error", data: err});
          else
            res.status(200).json({message: "Room Updated", data: newRoom});
        });
    }
  });

  createRoomRoute.get(function(req, res){
    if(!req.params.roomId)
      res.json({message:"No room id supplied", data: null});
    else{
      Room.findById(req.params.roomId)
        .then(function(room){
          res.json({message:"Room retrieved", data: room});
        })
        .catch(function(err){
          res.json({message:"Error", data: err});
        });
    };
  });

  return router;
}
