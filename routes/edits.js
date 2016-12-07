var Edit = require('../models/edit');

module.exports = function(router){

  var editsRoute = router.route('/api/edits/:roomId?');

  editsRoute.get(function(req,res){
    var roomId = req.params.roomId;
    var query = Edit.find();
    var limit = 1;
    if(roomId)
      query.where({roomId: roomId})

    if("sortBy" in req.query)
      query.sort(req.query.sortBy);
    else
      query.sort("-dateCreated");

    if("history" in req.query && req.query["history"] === "true")
      query.select('dateCreated')
    if("lastCreated" in req.query){
      var date = Date.parse(req.query["lastCreated"]);
      query.where({dateCreated: {$lte: date}});

      limit = null;
    }

    if(limit)
      query.limit(limit);

    query
    .then(function(edits){
      res.json({message: "Edits", data: edits});
    })
    .catch(function(err){
      res.json({message: "There was an error", data: err});
    })
  });

  var runCode = function(code, callback){
    var url = "http://api.hackerearth.com/code/run/";
    var client_secret_key = "6b818819b695ff01f3554203d3cf113bd4e2b478";

    callback();
    }

  editsRoute.post(function(req, res){
    var code = req.body.edit;
    if(!code){
      Edit.findOne({roomId: req.params.roomId, dateCreated: {$lte: (new Date()).toString()}}).sort("-dateCreated")
      .then(function(recentEdit){
        console.log(recentEdit);
        code = recentEdit.edit;
        runCode(code, function(){res.json({message: "Code ran"})});
      });
    }

    runCode(code, function(){res.json({message: "Code ran"})});
  });
  return router;
};
