/*global angular*/
(function(window, document) {
  'use strict';
  angular
    .module('docsApp')
    .controller('ToolbarController', ToolbarController);

  ToolbarController.$inject = [
    '$scope', '$location', '$mdDialog', 'TokenService'
  ];

  function ToolbarController($scope, $location, $mdDialog, TokenService) {
    var vm = this;
    vm.isLoggedIn = false;
    vm.searchText = '';

    vm.checkIfLoggedIn = checkIfLoggedIn;
    vm.openMenu = openMenu;
    vm.openProfile = openProfile;
    vm.openSearch = openSearch;
    vm.openDocument = openDocument;
    vm.openLogout = openLogout;

    function checkIfLoggedIn() {
      return TokenService.isAuthenticated();
    }

    function openMenu($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
    }

    function openSearch(e) {
      $location.path('/search');
      return e;
    }

    function openDocument(e) {
      $location.path('/document/add');
      return e;
    }

    function openProfile(e) {
      $location.path('/profile');
      return e;
    }

    function openLogout(e) {
      TokenService.clearToken();
      $location.path('/login');
      return e;
    }
  }
})();
