var Message = require('../models/message');

module.exports = function(router){

  var messagesRoute = router.route('/api/messages/:roomId?');

  messagesRoute.get(function(req, res){
    var roomId = req.params.roomId;
    var query = Message.find()
    if(roomId)
      query = query.where({roomId: roomId})

    query
    .then(function(messages){
      res.json({message: "Messages", data: messages});
    })
    .catch(function(err){
      res.json({message: "There was an error", data: err});
    })

  });

  return router;
};
