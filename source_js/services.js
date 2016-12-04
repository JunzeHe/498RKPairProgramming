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
  return {
    get: function() {
      return $http.get(baseUrl);
    }
  }
});
