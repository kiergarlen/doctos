(function(window, document, undefined) {
  'use strict';
  angular
    .module('docsApp')
    .controller('LoginController', LoginController);

  LoginController.$inject = [
    '$scope', '$location'
  ];

  function LoginController($scope, $location) {
    var vm = this;
    vm.isLoggedIn = false;
    vm.userData = {};
    vm.userName = '';
    vm.userPassword = '';

    vm.submitForm = submitForm;

    function submitForm(e) {
      $location.path('/search');
    }
  }
})();
