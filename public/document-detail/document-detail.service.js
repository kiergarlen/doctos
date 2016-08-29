/*global angular*/
(function() {
  'use strict';
  angular
    .module('docsApp')
    .factory('DocumentDetailService', DocumentDetailService);

  DocumentDetailService.$inject = [
    '$resource', 'TokenService'
  ];

  function DocumentDetailService($resource, TokenService) {
    return $resource('api/document', {}, {
      query: {
        method: 'GET',
        params: {documentId: 'documentId'},
        isArray: false,
        headers: {
          'Authorization': TokenService.getToken()
        }
      },
      get: {
        method: 'GET',
        params: {},
        isArray: true,
        headers: {
          'Authorization': TokenService.getToken()
        }
      },
      update: {
        method: 'PUT',
        params: {},
        isArray: false,
        headers: {
          'Authorization': TokenService.getToken()
        }
      },
      save: {
        method: 'POST',
        params: {},
        isArray: false,
        headers: {
          'Authorization': TokenService.getToken()
        }
      }
    });
  }
})();
