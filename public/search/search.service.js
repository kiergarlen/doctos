/*global angular*/
(function() {
  'use strict';
  angular
    .module('docsApp')
    .factory('SearchService', SearchService);

  SearchService.$inject = [
    '$resource', 'TokenService'
  ];

  function SearchService($resource, TokenService) {
    return $resource('api/search', {}, {
      query: {
        method: 'POST',
        params: {term: 'term'},
        isArray: true,
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
