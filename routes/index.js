/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
  app.use('/api', require('./home.js')(router));
  // app.use('/api', require('./llama.js')(router));
  app.use('/', require('./views.js')(router));

  require('./sockets.js')(app);
};
