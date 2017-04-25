/*global angular*/
(function() {
  'use strict';
  angular
    .module('docsApp')
    .factory('ProfileService', ProfileService);

  ProfileService.$inject = [
    '$resource', 'TokenService'
  ];

  function ProfileService($resource, TokenService) {
    return $resource('api/profile/:profileId', {}, {
      query: {
        method: 'GET',
        params: {profileId: 'profileId'},
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
      },
      delete: {
        method: 'DELETE',
        params: {profileId: 'profileId'},
        isArray: false,
        headers: {
          'Authorization': TokenService.getToken()
        }
      }
    });
  }
})();
