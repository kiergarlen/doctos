(function(window, document, undefined) {
  'use strict';
  angular
    .module('docsApp')
    .controller('LoginController', LoginController);

  LoginController.$inject = [
    '$scope', '$location', 'TokenService'
  ];

  function LoginController($scope, $location, TokenService) {
    var vm = this;
    vm.isLoggedIn = false;
    vm.userData = {};
    vm.userName = '';
    vm.userPassword = '';

    vm.submitForm = submitForm;

    function submitForm(e) {
      // if (!$scope.loginForm.$valid) {
      //   console.log('Ingrese usuario y/o contraseña');
      //   return;
      // }
      if (vm.userName.length > 1 && vm.userPassword.length > 1) {
        $location.path('/search');
        // console.log(TokenService.authenticate(
        //   vm.userName,
        //   vm.userPassword
        // ));
        // if (TokenService.isAuthenticated()) {
        // } else {
        //   // TODO: flash authentication error, clean up form
        // }
      }
    }
  }
})();
