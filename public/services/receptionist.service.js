/*global angular*/
(function() {
  'use strict';
  angular
    .module('docsApp')
    .factory('ReceptionistService', ReceptionistService);

  ReceptionistService.$inject = [
    '$resource', 'TokenService'
  ];

  function ReceptionistService($resource, TokenService) {
    return $resource('api/receptionist', {}, {
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
