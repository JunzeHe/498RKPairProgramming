var app = angular.module('app', ['ngRoute', 'PPControllers', 'PPServices', 'ui.codemirror', 'ngMaterial', 'ngclipboard']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/landing/:roomId?', {
      templateUrl: 'partials/landing.html',
      controller: 'LandingController'
    })
    .when('/room', {
      templateUrl: 'partials/room.html',
      controller: 'RoomController'
    })
    .otherwise({
      redirectTo: '/landing'
    });
}]);
