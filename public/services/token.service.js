/*global angular, CryptoJS*/
(function() {
  'use strict';
  angular
    .module('docsApp')
    .factory('TokenService', TokenService);

  TokenService.$inject = [
    '$window', '$http', '$location', 'jwtHelper'
  ];

  function TokenService($window, $http, $location, jwtHelper) {
    var TOKEN_KEY = 'jwt';
    var storage = $window.sessionStorage;
    var cachedToken;
    var Token = {};

    Token.hashMessage = hashMessage;
    Token.authenticate = authenticate;
    Token.isAuthenticated = isAuthenticated;
    Token.setToken = setToken;
    Token.getToken = getToken;
    Token.clearToken = clearToken;
    Token.decodeToken = decodeToken;
    Token.getUserFromToken = getUserFromToken;

    function hashMessage(message) {
      return CryptoJS.SHA256(message);
    }

    function authenticate(username, password) {
      $http({
        url: 'api/authenticate',
        method: 'POST',
        data: {
          email: username,
          password: password
        }
      }).then(function success(response) {
        var token = response.data.token || null;
        setToken(token);
        $location.path('/search');
      }, function error(response) {
        if (response.status === 404) {
          return 'Sin enlace al servidor';
        } else {
          return 'Error no especificado';
        }
      });
    }

    function isAuthenticated() {
      return !!getToken();
    }

    function setToken(token) {
      cachedToken = token;
      storage.setItem(TOKEN_KEY, token);
    }

    function getToken() {
      if (!cachedToken) {
        cachedToken = storage.getItem(TOKEN_KEY);
      }
      return cachedToken;
    }

    function clearToken() {
      cachedToken = null;
      storage.removeItem(TOKEN_KEY);
    }

    function decodeToken() {
      var token = getToken();
      return token && jwtHelper.decodeToken(token);
    }

    function getUserFromToken() {
      if (isAuthenticated()) {
        decodeToken();
      }
      return decodeToken();
    }

    return Token;
  }
})();
