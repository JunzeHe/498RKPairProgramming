var PPServices = angular.module('PPServices', []);

PPServices.factory('CommonData', function() {
  var username = "";
  var room = {};
  return {
    getUsername: function() {
      return username;
    },
    setUsername: function(newUsername) {
      username = newUsername;
    },
    getRoom: function() {
      return room;
    },
    setRoom: function(newRoom) {
      room = newRoom;
    }
  }
});

PPServices.factory('Backend', function($http, $window) {
  var baseUrl = "/api";

  return {
    createRoom: function(roomname) {
      return $http.post(baseUrl + "/room", {roomName: roomname});
    }
  }
});
