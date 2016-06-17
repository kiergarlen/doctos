(function(window, document, undefined) {
  'use strict';
  angular
    .module('docsApp')
    .factory('TokenService', TokenService);

  TokenService.$inject =[
    '$window', '$http', '$location', 'jwtHelper'
  ];

  function TokenService($window, $http, $location, jwtHelper) {
    var tokenKey = 'token';
    var storage = $window.localStorage;
    var cachedToken;
    var Token = {};

    Token.hashMessage = hashMessage;
    Token.authenticate = authenticate;
    Token.isAuthenticated = isAuthenticated;
    // Token.setToken = setToken;
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
        var token = response.data || null;
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
      storage.setItem(tokenKey, token);
    }

    function getToken() {
      if (!cachedToken) {
        cachedToken = storage.getItem(tokenKey);
      }
      return cachedToken;
    }

    function clearToken() {
      cachedToken = null;
      storage.removeItem(tokenKey);
    }

    function decodeToken() {
      var token = getToken();
      return token && jwtHelper.decodeToken(token);
    }

    function getUserFromToken() {
      var decodedJwt;
      var userData;
      if (isAuthenticated()) {
        decodedJwt = decodeToken();
        userData = {
          name: decodedJwt.nam,
          id: decodedJwt.uid,
          level: decodedJwt.ulv,
          role: decodedJwt.uro,
          area: decodedJwt.uar
        };
      }
      return userData;
    }

    return Token;
  }
})();
