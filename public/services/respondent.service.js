/*global angular*/
(function() {
  'use strict';
  angular
    .module('docsApp')
    .factory('RespondentService', RespondentService);

  RespondentService.$inject = [
    '$resource', 'TokenService'
  ];

  function RespondentService($resource, TokenService) {
    return $resource('api/respondent', {}, {
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
