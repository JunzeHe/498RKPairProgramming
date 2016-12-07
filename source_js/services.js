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
    },
    setMessages: function(newMessages){
      if(newMessages && newMessages.length > 0)
        $sessionStorage.messages = newMessages;
      else
        $sessionStorage.messages = [];
    },
    getMessages: function(){
      if(!$sessionStorage.messages)
        $sessionStorage.messages = []
      return $sessionStorage.messages;

    },
    setEdits: function(newEdits){
      $sessionStorage.edits = newEdits;
    },
    getEdits: function(){
      return $sessionStorage.edits;
    }
  }
}]);

PPServices.factory('Backend', ['$http', function($http) {
  var baseUrl = "/api";

  return {
    createRoom: function(roomName, roomPassword) {
      return $http.post(baseUrl + "/room", {roomName: roomName, roomPassword: roomPassword});
    },
    getRoom: function(roomId, roomPassword) {
      return $http.get(baseUrl + "/room/" + roomId, {params:{password: roomPassword}});
    },
    joinRoom: function(roomId, userName){
      return $http.post(baseUrl + "/room/"+ roomId,{userName: userName});
    },
    getMessages: function(roomId){
      return $http.get(baseUrl + "/messages/" + roomId);
    },
    getEdits: function(roomId){
      return $http.get(baseUrl + "/edits/" + roomId);
    }
  }
}]);
