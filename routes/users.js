var Message = require('../models/user');

module.exports = function(router){

  var userRoute = router.route('/api/user/:userId?');

  userRoute.get(function(req, res){

  });

  userRoute.post(function(req, res){

  });

  return router;
}
