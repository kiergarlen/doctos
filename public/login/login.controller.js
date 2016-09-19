/*global angular*/
(function(window, document) {
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
    vm.userName = '';
    vm.userPassword = '';

    vm.submitForm = submitForm;

    TokenService.clearToken();

    function submitForm(e) {
      if (vm.userName.length > 1 && vm.userPassword.length > 1) {
        e.preventDefault();
        TokenService.authenticate(
          vm.userName,
          vm.userPassword
        );
      }
    }

  }
})();
