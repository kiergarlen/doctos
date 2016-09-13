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
      }
    });
  }
})();
