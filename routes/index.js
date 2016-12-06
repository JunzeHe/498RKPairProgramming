/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
  // app.use('/api', require('./llama.js')(router));
  //
  app.use('/', require('./views.js')(router));
  app.use('/', require('./home.js')(router));
  app.use('/', require('./room.js')(router));
  app.use('/', require('./messages.js')(router));
  app.use('/', require('./edits.js')(router));
  app.use('/', require('./users.js')(router));

  require('./sockets.js')(app);
};
