var PPControllers = angular.module('PPControllers', []);

PPControllers.controller('LandingController', [
  '$scope', 'Backend', 'CommonData', '$location', '$routeParams',
  function($scope, Backend, CommonData, $location, $routeParams) {

    $scope.roomId = $routeParams.roomId;
    $scope.username = "";
    $scope.roomName = "";
    $scope.createRoom = function(isValid) {
      $scope.submitted = true;
      $scope.error = "";
      $scope.hasError = false;
      console.log(isValid);
      if (isValid) {
        CommonData.setUsername($scope.username);
        Backend.createRoom($scope.roomName).then(function(res) {
          console.log(res);
          CommonData.setRoom(res.data.data);
          $location.url('/room');
        }, function(res) {
          console.log("failure");
          $scope.hasError = true;
          $scope.error = res;
        });
      }
    }
    $scope.joinRoom = function(isValid) {
      $scope.submitted = true;
      $scope.error = "";
      $scope.hasError = false;
      if (isValid) {
        CommonData.setUsername($scope.username);
        Backend.getRoom($scope.roomId).then(function(res) {
          console.log(res);
          var room = res.data.data;
          if (room.users.includes($scope.username)) {
            console.log("failure");
            $scope.hasError = true;
            $scope.error = "Duplicate username for room " + room.roomName + ". Please enter a unique username.";
          } else {
            CommonData.setRoom(room);
            $location.url('/room');
          }
        }, function(res) {
          console.log("failure");
          $scope.hasError = true;
          $scope.error = res;
        });

        Backend.getMessages($scope.roomId)
        .then(function(messages){
          CommonData.setMessages(messages.data.data);
        });

        Backend.getEdits($scope.roomId)
        .then(function(edits){
          CommonData.setEdits(edits.data.data);
        });
      }
    }
  }
]);

PPControllers.controller('RoomController', ['$scope', 'Backend', 'CommonData', function($scope, Backend, CommonData) {
  $scope.editorOptions = {
    lineWrapping: true,
    lineNumbers: true,
    viewportMargin: Infinity
  };
  $scope.codemirrorLoaded = function(_editor) {
    _editor.focus();
    _editor.setValue("console.log('Hello world!');");
    _editor.setCursor({line: 1, ch: 0})
  }

  $scope.room = CommonData.getRoom();
  $scope.username = CommonData.getUsername();
  $scope.chatMsg = "";
  $scope.serverResponses = [];
  $scope.messages = CommonData.getMessages();

  Backend.joinRoom($scope.room._id, $scope.username);

  var socket = io();
  socket.emit('store username and roomId', {username: $scope.username, roomId: $scope.room._id});
  socket.on('response', function(res){
    $scope.$apply(function(){
      $scope.serverResponses.push(res.data);
    });
  });

  socket.on('new user', function(newUserName){
    room = CommonData.getRoom();
    room.users.push(newUserName);
    CommonData.setRoom(room);
    $scope.room = room;
  });

  socket.on('user has left room', function(oldUserName){
    room = CommonData.getRoom();
    room.users.splice(room.users.indexOf(oldUserName), 1);
    CommonData.setRoom(room);
    $scope.room = room;
  });

  $scope.sendMsg = function(isValid) {
    if (!isValid) {
      return;
    }

    var message = {
      dateCreated: new Date(),
      userName: $scope.username,
      roomName: $scope.room.roomName,
      roomId: $scope.room._id,
      message: $scope.chatMsg
    }
    socket.emit('chat message',message);
    $scope.messages.push(message);
    $scope.chatMsg = "";
  }

  socket.on('new chat message', function(data){
    $scope.$apply(function(){$scope.messages.push(data.data);});
  });

  socket.on('new edit', function(data){
    //Handle incoming edits from other people here
  });
}]);
