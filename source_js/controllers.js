var PPControllers = angular.module('PPControllers', []);

PPControllers.controller('LandingController', ['$scope', 'Backend', 'CommonData', '$location', function($scope, Backend, CommonData, $location) {
  $scope.username = "";
  $scope.roomname = "";
  $scope.createRoom = function(isValid) {
    $scope.submitted = true;
    $scope.error = "";
    $scope.hasError = false;
    console.log(isValid);
    if (isValid) {
      CommonData.setUsername($scope.username);
      // $location.path('/room');
      Backend.createRoom($scope.roomname).then(function(res) {
        console.log("success");
        $scope.$apply($location.url('/room/' + res));
      }, function(res) {
        console.log("failure");
        $scope.hasError = true;
        $scope.error = res;
      });

    }
  }
}]);

PPControllers.controller('RoomController', ['$scope', 'Backend', 'CommonData', '$routeParams', function($scope, Backend, CommonData, $routeParams) {
  $scope.roomId = $routeParams.roomId;
}]);
