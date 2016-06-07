  //config.js
/*global angular, CryptoJS*/
(function(window, document, undefined) {
  angular
    .module('docsApp')
    .config(
      [
        '$routeProvider', '$httpProvider',
        '$mdThemingProvider', 'jwtInterceptorProvider',
        config
      ]
    );
  // angular
  //   .module('docsApp')
  //   .config(
  //     [
  //       '$stateProvider', '$urlRouterProvider', '$httpProvider',
  //       '$mdThemingProvider', 'jwtInterceptorProvider',
  //       config
  //     ]
  //   );
  function config($stateProvider, $urlRouterProvider, $httpProvider,
    $mdThemingProvider, jwtInterceptorProvider) {
    $mdThemingProvider.definePalette('ceaPalette', {
      '50':'e9f1fa',
      '100':'bed4ef',
      '200':'93b8e5',
      '300':'6ea0dc',
      '400':'4a88d3',
      '500':'2670ca',
      '600':'2162b1',
      '700':'1d5498',
      '800':'18467e',
      '900':'133865',
      'A100':'bed4ef',
      'A200':'93b8e5',
      'A400':'4a88d3',
      'A700':'1d5498'
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50', '100','200', '300', '400', 'A100'],
      'contrastLightColors': undefined
    });

    $mdThemingProvider.theme('default')
      .primaryPalette('ceaPalette')
      .accentPalette('indigo')
      .warnPalette('red');

    $routeProvider
      .otherwise({
        redirectTo: '/search'
      })
      // .when('/sistema/login', {
      //   templateUrl: 'partials/sistema/login.html',
      //   controller: 'LoginController',
      //   controllerAs: 'login'
      // })
      .when('/search', {
        templateUrl: 'search/search.html',
        controller: 'SearchController',
        controllerAs: 'search'
      })
      // .when('/sistema/logout', {
      //   templateUrl: 'partials/sistema/logout.html',
      //   controller: 'LogoutController',
      //   controllerAs: 'logout'
      // })
    ;
    /*
    $urlRouterProvider.otherwise("/search");
    $stateProvider
      .state('searchView'. {
        url: '/search',
        templateUrl: 'search/search.html',
        controller: 'SearchController',
        controllerAs: 'search'
      });
    */
  }
)();

/*
  $urlRouterProvider
    .otherwise("/search")
    .state('login', {
      url: "/login",
      templateUrl: "login/login.html",
      controller: 'LoginController',
      controllerAs: 'login'
    })
    .state('logout', {
      url: "/logout",
      templateUrl: "logout/logout.html",
      controller: 'LogoutController',
      controllerAs: 'logout'
    })
    .state('search', {
      url: "/search",
      templateUrl: "search/search.html",
      controller: 'SearchController',
      controllerAs: 'search'
    })
  ;
*/
