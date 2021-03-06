/*global angular*/
(function() {
  'use strict';
  angular
    .module('docsApp')
    .factory('StatusService', StatusService);

  StatusService.$inject = [
    '$resource', 'TokenService'
  ];

  function StatusService($resource, TokenService) {
    return $resource('api/status', {}, {
      get: {
        method: 'GET',
        params: {},
        isArray: true,
        headers: {
          'Authorization': TokenService.getToken()
        }
      }
    });
  }
})();
