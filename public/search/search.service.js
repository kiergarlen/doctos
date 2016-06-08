(function(window, document, undefined) {
  'use strict';
  angular
    .module('docsApp')
    .factory('SearchService', SearchService);
  SearchService.$inject =[
      '$resource', 'TokenService'
  ];

  function SearchService($resource, TokenService) {
    return $resource('api/v1/search', {}, {
      query: {
        method: 'POST',
        params: {term: 'term'},
        isArray: true//,
        // headers: {
        //   'Auth-Token': TokenService.getTokenHeader()
        // }
      }
    });
  }
})();