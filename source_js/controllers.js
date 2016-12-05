var PPControllers = angular.module('PPControllers', []);

PPControllers.controller('LandingController', ['$scope', 'Backend', 'CommonData', '$location', function($scope, Backend, CommonData, $location) {
  $scope.username = "";
  $scope.roomName = "";
  $scope.createRoom = function(isValid) {
    $scope.submitted = true;
    $scope.error = "";
    $scope.hasError = false;
    console.log(isValid);
    if (isValid) {
      CommonData.setUsername($scope.username);
      // $location.path('/room');
      Backend.createRoom($scope.roomName).then(function(res) {
        console.log(res);
        CommonData.setRoom(res.data.data);
        $location.url('/room');
        // $scope.$apply($location.url('/room/' + res.data.data._id));
      }, function(res) {
        console.log("failure");
        $scope.hasError = true;
        $scope.error = res;
      });

    }
  }
}]);

PPControllers.controller('RoomController', ['$scope', 'Backend', 'CommonData', function($scope, Backend, CommonData) {
  $scope.room = CommonData.getRoom();
  $scope.username = CommonData.getUsername();
}]);
