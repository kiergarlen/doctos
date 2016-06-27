(function(window, document, undefined) {
  'use strict';
  angular
    .module('docsApp')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = [
    '$scope', '$location', '$mdDialog'
  ];

  function ProfileController($scope, $location, $mdDialog) {
    var vm = this;
    vm.isLoggedIn = false;
    vm.userData = {};
    vm.currentPassword = '';
    vm.newPassword = '';

    vm.submitForm = submitForm;

    function submitForm(ev) {
      //TODO: Check if password is valid
      //Show user feddback before persisting to database
      var confirm = $mdDialog.confirm()
        .title('¿Confirmar cambio de contraseña?')
        .textContent('Su contraseña será actualizada y saldrá del sistema')
        .ariaLabel('Confirmar el cambio de contraseña')
        .targetEvent(ev)
        .ok('Aceptar')
        .cancel('Cancelar');
      $mdDialog.show(confirm)
        .then(function() {
          //TODO: persist changes to database
          //TODO: if persist succeeds, logout and navigate to login
          $location.path('/login');
        }, function() {
          //TODO: clear password update form
        }
      );
    }
  }
})();
