  //config.js
  angular
    .module('docsApp')
    .config(
      [
        '$routeProvider', '$httpProvider', 'jwtInterceptorProvider',
        config
      ]
    );
  function config($routeProvider, $httpProvider, jwtInterceptorProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/search'
      }).
      when('/sistema/login', {
        templateUrl: 'partials/sistema/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      }).
      when('/search', {
        templateUrl: 'search/search.html',
        controller: 'SearchController',
        controllerAs: 'search'
      }).
      when('/sistema/logout', {
        templateUrl: 'partials/sistema/logout.html',
        controller: 'LogoutController',
        controllerAs: 'logout'
      })
    ;
  }
