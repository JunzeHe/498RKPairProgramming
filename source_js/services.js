var PPServices = angular.module('PPServices', []);

PPServices.factory('CommonData', function() {
  var username = "";
  return {
    getUsername: function() {
      return username;
    },
    setUsername: function(newUsername) {
      username = newUsername;
    }
  }
});

PPServices.factory('Backend', function($http, $window) {
  var baseUrl = "";
  var get = function() {
    return $http.get(baseUrl);
  }
  return {
    createRoom: function(roomname) {
      var promise = new Promise(function(resolve, reject) {
        setTimeout(function() {
          if (true) {
            resolve("dummyId" + roomname);
          } else {
            reject(Error("It broke"));
          }
        }, 1000);
      });

      return promise;
    }
  }
});
