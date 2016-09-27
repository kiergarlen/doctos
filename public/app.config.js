/*global angular*/
(function(window, document) {
  'use strict';
  angular
    .module('docsApp')
    .config([
      '$routeProvider',
      '$mdThemingProvider',
      config
    ]);

  function config($routeProvider, $mdThemingProvider) {
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
      'A700':'1d5498',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],
      'contrastLightColors': undefined
    });

    $mdThemingProvider.theme('default')
      .primaryPalette('ceaPalette')
      .accentPalette('blue')
      .warnPalette('red');

    $routeProvider
      .otherwise({
        redirectTo: '/login'
      })
      .when('/login', {
        templateUrl: 'login/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })
      .when('/profile', {
        templateUrl: 'profile/profile.html',
        controller: 'ProfileController',
        controllerAs: 'profile'
      })
      .when('/list', {
        templateUrl: 'list/list.html',
        controller: 'ListController',
        controllerAs: 'list'
      })
      .when('/search', {
        templateUrl: 'search/search.html',
        controller: 'SearchController',
        controllerAs: 'search'
      })
      .when('/advanced/search', {
        templateUrl: 'advanced-search/advanced-search.html',
        controller: 'AdvancedSearchController',
        controllerAs: 'advancedSearch'
      })
      .when('/document/add', {
        templateUrl: 'document/document.html',
        controller: 'DocumentController',
        controllerAs: 'document'
      })
      .when('/document/view/:documentId', {
        templateUrl: 'document-detail/document-detail.html',
        controller: 'DocumentDetailController',
        controllerAs: 'documentDetail'
      })
      .when('/document/edit/:documentId', {
        templateUrl: 'document/document.html',
        controller: 'DocumentController',
        controllerAs: 'document'
      })
    ;
  }
})();
