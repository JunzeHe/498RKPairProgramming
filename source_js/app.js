var app = angular.module('app', ['ngRoute', 'PPControllers', 'PPServices']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/landing', {
      templateUrl: 'partials/landing.html',
      controller: 'LandingController'
    })
    .otherwise({
      redirectTo: '/landing'
    });
}]);
