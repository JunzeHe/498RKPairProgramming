var Edit = require('../models/edit');

module.exports = function(router){

  var editsRoute = router.route('/api/edits/:roomId?');

  editsRoute.get(function(req,res){
    var roomId = req.params.roomId;
    var query = Edit.find()
    if(roomId)
      query = query.where({roomId: roomId})

    if("sortBy" in req.query)
      query.sort(req.query.sortBy);
    else
      query.sort("-dateCreated");

    query
    .then(function(edits){
      res.json({message: "Edits", data: edits});
    })
    .catch(function(err){
      res.json({message: "There was an error", data: err});
    })
  });





  return router;
};
