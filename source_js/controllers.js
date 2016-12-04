var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('SocketsExampleController', ['$scope',function($scope, CommonData) {
  var socket = io();
  $scope.data = "";
  $scope.displayText = ""

  $scope.setData = function(){
    // CommonData.setData($scope.data);
    socket.emit('literally any event name', $scope.data);
    $scope.displayText = "Data sent"
  };

  socket.on('kickass mindwashing emission', function(msg){
    //Super important that you do $scope.$apply when you receive emissions for speedups
    $scope.$apply(function(){$scope.displayText = msg;});
    console.log(msg);
  });

}]);


mp4Controllers.controller('FirstController', ['$scope', 'CommonData'  , function($scope, CommonData) {
  $scope.data = "";
  $scope.displayText = ""

  $scope.setData = function(){
    // CommonData.setData($scope.data);

    $scope.displayText = "Data set"

  };

}]);

mp4Controllers.controller('SecondController', ['$scope', 'CommonData' , function($scope, CommonData) {
  $scope.data = "";

  $scope.getData = function(){
    $scope.data = CommonData.getData();

  };

}]);


mp4Controllers.controller('LlamaListController', ['$scope', '$http', 'Llamas', '$window' , function($scope, $http,  Llamas, $window) {

  Llamas.get().success(function(data){
    $scope.llamas = data;
  });


}]);

mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";

  };

}]);
