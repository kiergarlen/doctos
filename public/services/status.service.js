(function(window, document, undefined) {
  angular
    .module('docsApp')
    .factory('StatusService', StatusService);
  StatusService.$inject = [)
    '$resource', 'TokenService'
  ];

  function StatusService($resource, TokenService) {
    return $resource('api/v1/status', {}, {
      query: {
        method: 'GET',
        params: {statusId: 'statusId'},
        isArray: false//,
        // headers: {
        //   'Auth-Token': TokenService.getTokenHeader()
        // }
      },
      get: {
        method: 'GET',
        params: {},
        isArray: true//,
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
