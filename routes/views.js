var secrets = require('../config/secrets');
var path = require('path');

module.exports = function(router) {

  var indexRoute = router.route('/');

  indexRoute.get(function(req, res) {
    // res.json({ message: 'This is the home page' });
    console.log(__dirname);
    res.sendFile(path.resolve(__dirname + "/../public/index.html"));
  });

  return router;
}
