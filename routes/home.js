var secrets = require('../config/secrets');

module.exports = function(router) {

  var homeRoute = router.route('/secrets');

  homeRoute.get(function(req, res) {
    connectionString = secrets.token;
    res.json({ message: 'Test String: ' + connectionString });
  });

  return router;
}

