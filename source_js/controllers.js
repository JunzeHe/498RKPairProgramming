var PPControllers = angular.module('PPControllers', []);

PPControllers.controller('LandingController', ['$scope', 'Backend', 'CommonData', '$location', function($scope, Backend, CommonData, $location) {
  $scope.username = "";
  $scope.roomname = "";
  $scope.createRoom = function(isValid) {
    $scope.submitted = true;
    $scope.error = "";
    $scope.hasError = false;
    if (isValid) {
      CommonData.setUsername($scope.username);
      // Backend.createRoom($scope.roomname).then(function(res) {
      //   $location.path('/room')
      // }, function(res) {
      //   $scope.hasError = true;
      //   $scope.error = res;
      // });
      $location.path('/room')
    }
  }
}]);

PPControllers.controller('RoomController', ['$scope', 'Backend', 'CommonData', function($scope, Backend, CommonData) {

}]);
