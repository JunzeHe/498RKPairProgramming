#Pair Programming 

##Presentation 
###Important User Flows
- Create a private/secure room or a casual room for everyone to participate in creating code
- Share and edit live code
- Personalize development environment
- Chat alongside with the code
- Compile and Run code within the browser

###Voice Over Scripts


###Motivation Behind Design Decisions
**How did heuristic evaluation play a role in changes that were made to the interface**
Heuristics: 
- **Flexibility and Efficiency of Use**: Keyboard shortcuts. Multiple languages supported. Highly customizable text area because everyone has different preferences. 
- **Aesthetic and Minimalist Design**: Big text areas for code and display chat which is where the user will focus on most. No need to sign up for an account. Create and room and code!
- **User Control and Freedom**: Easily leave and reenter a room. Undo and redo. 

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
  - Returns latest edit/version for room with roomId
  - URL Params
    - history -> if true, returns only a list of dates corresponding to the edits
    - lastCreated = dateString -> returns list of Edits before lastCreated
  - To get all of the edits in a room, set lastCreated to be in the future 
- **GET /api/messages/:roomId?**
  - Returns all message for a room with roomId
  - Returns messages for every room if roomId is empty
- **GET /api/room/:roomId
  - Returns the entire room object, most importantly the roomName, and the users
- **POST /api/room**
  - POST data should have {roomName: \<room name\>, userName: \<user name\>}
  - Use this **ONLY** when you are creating a completely new room
  - Returns the room that was created. Store the `__id` as the `roomId`
- **POST /api/room/:roomId/**
  - POST data should have {userName: \<user name\>}
  - Add user to the room
  - Use when user is joining the room
