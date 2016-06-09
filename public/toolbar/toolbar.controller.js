(function(window, document, undefined) {
  'use strict';
  angular
    .module('docsApp')
    .controller('ToolbarController', ToolbarController);

  ToolbarController.$inject = [
    '$scope', '$location', '$mdDialog'
  ];

  function ToolbarController($scope, $location, $mdDialog) {
    var vm = this;
    var originatorEvent;
    vm.isLoggedIn = true;
    vm.searchText = '';

    vm.openMenu = openMenu;
    vm.openProfile = openProfile;
    vm.openSearch = openSearch;
    vm.openDocument = openDocument;
    vm.openLogout = openLogout;

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
      $mdDialog.show(
        $mdDialog.alert()
          .targetEvent(originatorEvent)
          .clickOutsideToClose(true)
          .title('Atención')
          .textContent('Ver perfil?')
          .ariaLabel('Ventana de diálogo')
          .ok('Ok')
      );
      originatorEvent = null;
    }

    function openLogout($event) {
      $mdDialog.show(
        $mdDialog.alert()
          .targetEvent(originatorEvent)
          .clickOutsideToClose(true)
          .title('Atención')
          .textContent('Salir?')
          .ariaLabel('Ventana de diálogo')
          .ok('Ok')
      );
      originatorEvent = null;
    }
  }
})();
