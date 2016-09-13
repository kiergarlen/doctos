/*global angular*/
(function() {
  'use strict';
  angular
    .module('docsApp')
    .factory('ReceiverTypeService', ReceiverTypeService);

  ReceiverTypeService.$inject = [
    '$resource', 'TokenService'
  ];

  function ReceiverTypeService($resource, TokenService) {
    return $resource('api/receiver/type', {}, {
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
