// Get the packages we need
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
// var compass = require('node-compass');
var path = require('path');
var mongoose = require('mongoose');
var secrets = require('./config/secrets');

// Create our Express application
var app = express();

// Listen for socket clients
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

app.use(express.static('public'))
// app.configure(function() {
// app.use(compass({
//   project : __dirname,
//   sass : 'source_sass',
//   css : 'public/css',
//   cache: false,
//   config_file : path.join(__dirname, '/compass_config.rb')
// }));
// });

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// Use routes as a module (see index.js)
require('./routes')(app, router);
require('./routes/sockets.js')(io);

mongoose.connect(secrets.mongo_connection);

// Start the server
http.listen(port);
// app.listen(port);
console.log('Server running on port ' + port);
