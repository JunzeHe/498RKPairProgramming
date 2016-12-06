var PPServices = angular.module('PPServices', ['ngStorage']);

PPServices.factory('CommonData', ['$sessionStorage', function($sessionStorage) {
  var username = $sessionStorage.username;
  var room = $sessionStorage.room;
  return {
    getUsername: function() {
      return username;
    },
    setUsername: function(newUsername) {
      username = $sessionStorage.username = newUsername;
    },
    getRoom: function() {
      return room;
    },
    setRoom: function(newRoom) {
      room = $sessionStorage.room = newRoom;
    }
  }
}]);

PPServices.factory('Backend', ['$http', function($http) {
  var baseUrl = "/api";

  return {
    createRoom: function(roomName) {
      return $http.post(baseUrl + "/room", {roomName: roomName});
    },
    getRoom: function(roomId) {
      return $http.get(baseUrl + "/room/" + roomId.toString());
    },
    joinRoom: function(roomId, userName){
      return $http.post(baseUrl + "/room/"+ roomId.toString(),{userName: userName});
    }
  }
}]);
