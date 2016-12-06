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
      }
    }
  }
]);

PPControllers.controller('RoomController', ['$scope', 'Backend', 'CommonData', function($scope, Backend, CommonData) {
  $scope.room = CommonData.getRoom();
  $scope.username = CommonData.getUsername();
  $scope.chatMsg = "";
  $scope.serverResponses = [];

  var socket = io();
  socket.on('response', function(res) {
    $scope.$apply(function() {
      $scope.serverResponses.push(res.data);
    });
  });
  $scope.sendMsg = function(isValid) {
    if (!isValid) {
      return;
    }
    socket.emit('chat message', {
      dateCreated: new Date(),
      userName: $scope.username,
      roomName: $scope.room.roomName,
      roomId: $scope.room.roomId,
      message: $scope.chatMsg
    });
    $scope.chatMsg = "";
  }
}]);
