(function(window, document, undefined) {
  'use strict';
  angular
    .module('docsApp')
    .controller('LoginController', LoginController);

  LoginController.$inject = [
    '$scope', '$location', '$mdDialog'
  ];

  function LoginController($scope, $location, $mdDialog) {
    var vm = this;
    vm.isLoggedIn = false;
    vm.userData = {};
    vm.userName = '';
    vm.userPassword = '';

    vm.submitForm = submitForm;

    function submitForm(e) {
      console.log(e);
      alert('login');
    }

    function openSearch($event) {
      $location.path('/search');
    }
  }
})();
