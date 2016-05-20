  //config.js
/*global angular, CryptoJS*/
(function(){
  "use strict";

  angular.module('docsApp.config').config(["$mdThemingProvider",
    function($mdThemingProvider) {
      $mdThemingProvider.definePalette('ceaMain',
        {
          '50':'#e9f1fa',
          '100':'#bed4ef',
          '200':'#93b8e5',
          '300':'#6ea0dc',
          '400':'#4a88d3',
          '500':'#2670ca',
          '600':'#2162b1',
          '700':'#1d5498',
          '800':'#18467e',
          '900':'#133865',
          'A100':'#bed4ef',
          'A200':'#93b8e5',
          'A400':'#4a88d3',
          'A700':'#1d5498'
        }
      );

      $mdThemingProvider.theme('default')
        .primaryPalette('ceaMain')
        .accentPalette('indigo')
        .warnPalette('red');
    }]);

})();


(function(window, document, undefined) {
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
)();
