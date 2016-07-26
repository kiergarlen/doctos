(function(window, document, angular) {
  angular
    .module('docsApp')
    .factory('StatusService', StatusService);
  StatusService.$inject = [
    '$resource', 'TokenService'
  ];

  function StatusService($resource, TokenService) {
    return $resource('api/v1/status', {}, {
      query: {
        method: 'GET',
        params: {statusId: 'statusId'},
        isArray: false//,
        // headers: {
        //   'Authorization': TokenService.getToken()
        // }
      },
      get: {
        method: 'GET',
        params: {},
        isArray: true//,
        // headers: {
        //   'Authorization': TokenService.getToken()
        // }
      },
      update: {
        method: 'POST',
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
