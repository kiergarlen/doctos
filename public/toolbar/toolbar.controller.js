(function(window, document, undefined) {
  'use strict';
  angular
    .module('docsApp')
    .controller('ToolbarController', ToolbarController);

  ToolbarController.$inject = [
    '$scope', '$location', '$mdDialog', 'TokenService'
  ];

  function ToolbarController($scope, $location, $mdDialog, TokenService) {
    var vm = this;
    var originatorEvent;
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
      originatorEvent = ev;
      $mdOpenMenu(ev);
    }

    function openSearch($event) {
      $location.path('/search');
    }

    function openDocument($event) {
      $location.path('/document/add');
    }

    function openProfile($event) {
      $location.path('/profile');
      originatorEvent = null;
    }

    function openLogout($event) {
      originatorEvent = null;
      TokenService.clearToken();
      $location.path('/login');
    }
  }
})();
