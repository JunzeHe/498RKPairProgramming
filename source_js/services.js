var PPServices = angular.module('PPServices', []);

PPServices.factory('CommonData', function() {
  var data = "";
  return {
    getData: function() {
      return data;
    },
    setData: function(newData) {
      data = newData;
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
