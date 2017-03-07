/*global angular*/
(function() {
  'use strict';
  angular
    .module('docsApp')
    .factory('PasswordService', PasswordService);

  PasswordService.$inject = [
    'TokenService'
  ];

  function PasswordService(TokenService) {
    var Pwd = {};
    Pwd.authenticate = authenticate;

    function authenticate(message) {
      return CryptoJS.SHA256(message);
    }

    return Pwd;
  }
})();
