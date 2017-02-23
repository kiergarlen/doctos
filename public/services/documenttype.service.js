/*global angular*/
(function() {
  'use strict';
  angular
    .module('docsApp')
    .factory('DocumentTypeService', DocumentTypeService);

  DocumentTypeService.$inject = [
    '$resource', 'TokenService'
  ];

  function DocumentTypeService($resource, TokenService) {
    return $resource('api/document_type', {}, {
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
