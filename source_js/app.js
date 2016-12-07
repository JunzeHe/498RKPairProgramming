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

app.directive('scrollBottom', function() {
  return {
    scope: {
      scrollBottom: "="
    },
    link: function(scope, element) {
      scope.$watchCollection('scrollBottom', function(newValue) {
        if (newValue) {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });
    }
  }
})
