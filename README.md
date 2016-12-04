#Starter Code for CS498RK Final Project - Pair Programming

##Setup 
1. `bower install`
2. `npm install`

##Running
Run `grunt` to generate css files and start server

###Notes on Sockets
####Client Side
Create a socket with `var socket = io()`. It will automatically connect to the server that sent the file.
Send a message with `socket.emit(<event name>, <data>)`
Await messages with `socket.on(<event name>, function(<data>){})`
If you want to update Angular after you receive messages, make sure to do `$scope.$apply(function(){ <changes>})` because Angular does not know about sockets. 

Sample code in `source_js/controllers.js`

###Server Side
Await messages also with `socket.on`
Emit messages to everyone with `io.emit(<even name>, <message>)`
You can also use `broadcast` if you want to exclude sockets
Sample code in `routes/sockets.js`
