#Starter Code for CS498RK Final Project - Pair Programming

##Setup 
1. `bower install`
2. `npm install`

##Running
Run `grunt` to generate css files and start server

##Connecting to Backend/Server
All responses through sockets and http requests will have form {message: String, data: Object}
###Sockets
- **Create a socket**
  - `var socket = io()`
  - It will automatically connect to the server that sent the file.
  - Create this once per controller. The socket does not need to be the same per controller. 
- **Send a message**
  - `socket.emit(<event name>, <data>)`
- **Await messages**
  -`socket.on(<event name>, function(<data>){})`
  - If you want to update Angular after you receive messages, make sure to do `$scope.$apply(function(){ <changes>})` because Angular does not know about sockets. 
- **Expected Emission for Code Edit**
```javascript
    $scope.keyPressed = function(){
    socket.emit('new edit',
      {   
        dateCreated: new Date(),
        userId: userId,
        userName: "Dummy",
        roomName: "Dummy Room",
        roomId: roomId,
        edit: $scope.dummyCode
      }); 
};
```
- **Expected Emission for new message**
```javascript
 $scope.sendMsg = function(){
    socket.emit('chat message',
      {   
        dateCreated: new Date(),
        userId: userId,
        userName: "Dummy",
        roomName: "Dummy Room",
        roomId: roomId,
        message: $scope.chatMsg
      });
    }
```
- **Receiving Response from server**
```javascript
  socket.on('response', function(res){
    $scope.$apply(function(){
      $scope.serverResponses.unshift(res);
    });
  });
```
Sample code in `source_js/controllers.js`

### Endpoints
- **GET Defaults**
  - Ordered by date created
  - Does not support Mongoose style filtering yet
- **GET /api/edits/:roomId?**
  - Returns all edits for room with roomId
  - Returns edits for every room if roomId is empty
  - URL Params
    - history -> if true, returns only a list of dates corresponding to the edits
    - lastCreated = dateString -> returns list of Edits before lastCreated
- **GET /api/messages/:roomId?**
  - Returns all message for a room with roomId
  - Returns messages for every room if roomId is empty
- **POST /api/room**
  - POST data should have {roomName: \<room name\>}
  - Use this **ONLY** when you are creating a completely new room
  - Returns the room that was created. Store the `__id` as the `roomId`
