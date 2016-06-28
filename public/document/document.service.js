(function(window, document, undefined) {
  'use strict';
  angular
    .module('docsApp')
    .factory('DocumentService', DocumentService);

  DocumentService.$inject = [
    '$resource', 'TokenService'
  ];

  function DocumentService($resource, TokenService) {
    return $resource('api/v1/document', {}, {
      query: {
        method: 'GET',
        params: {documentId: 'documentId'},
        isArray: false//,
        // headers: {
        //   'Auth-Token': TokenService.getTokenHeader()
        // }
      },
      get: {
        method: 'GET',
        params: {},
        isArray: true,
        // headers: {
        //   'Auth-Token': TokenService.getTokenHeader()
        // }
      },
      update: {
        method: 'POST',
        params: {},
        isArray: false//,
        // headers: {
        //   'Auth-Token': TokenService.getTokenHeader()
        // }
      },
      save: {
        method: 'POST',
        params: {},
        isArray: false//,
        // headers: {
        //   'Auth-Token': TokenService.getTokenHeader()
        // }
      }
    });
  }
})();
