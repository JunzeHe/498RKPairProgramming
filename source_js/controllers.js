var PPControllers = angular.module('PPControllers', []);

PPControllers.controller('LandingController', ['$scope', 'Backend', 'CommonData', function($scope, Backend, CommonData) {
  $scope.username = "";
  $scope.roomname = "";
}]);
