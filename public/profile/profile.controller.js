/*global angular*/
(function(window, document) {
  'use strict';
  angular
    .module('docsApp')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = [
    '$scope',
    '$location',
    '$mdDialog',
    'TokenService',
    'PasswordService'
  ];

  function ProfileController(
      $scope,
      $location,
      $mdDialog,
      TokenService,
      PasswordService
    ) {
    var vm = this;
    vm.fullName = TokenService.getUserFromToken()._doc.name;
    vm.currentPassword = '';
    vm.newPassword = '';
    vm.submitForm = function(ev) {
      // TODO: Check if password is valid
      // Show user feddback before persisting to database
      var confirm = $mdDialog.confirm()
        .title('¿Confirmar cambio de contraseña?')
        .textContent('Se actualizará su contraseña y saldrá del sistema')
        .ariaLabel('Confirmar cambio de contraseña')
        .targetEvent(ev)
        .ok('Aceptar')
        .cancel('Cancelar');
      $mdDialog.show(confirm)
        .then(function() {
          //PasswordService.
          //TODO: persist changes to database
          //TODO: if persist succeeds, logout and navigate to login
          $location.path('/login');
        }, function() {
          vm.currentPassword = '';
          vm.newPassword = '';
        }
      );
    };
  }
})();
