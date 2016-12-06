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
          CommonData.setRoom(res.data.data);
          $location.url('/room');
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
  var socket = io();
  $scope.sendMsg = function() {
    socket.emit('chat message', {
      dateCreated: new Date(),
      userName: $scope.username,
      roomName: $scope.room.roomName,
      roomId: $scope.room.roomId,
      message: $scope.chatMsg
    });
  }
}]);
