var Room = require('../models/room');

module.exports = function(router) {
  var createRoomRoute = router.route('/api/room/:roomId?');

  createRoomRoute.post(function(req,res){
    if('roomName' in req.body && req.body['roomName'].length > 0){
      var roomName = req.body['roomName'];
      var room = new Room({roomName: roomName});

      room.save(function(err, createdRoom){
        if(err)
          res.json({message: "There was an error", data: err});
        else
          res.json({message: "Room Created", data: createdRoom});
      });
    }
  });

  createRoomRoute.get(function(req, res){
    if(!req.query.roomId)
      res.json({message:"No room id supplied", data: null});
    else{
      Room.findById(req.query.roomId)
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
