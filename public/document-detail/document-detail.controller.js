/*global angular*/
(function() {
  'use strict';

  angular
    .module('docsApp')
    .controller('DocumentDetailController', DocumentDetailController);

  DocumentDetailController.$inject = [
    '$location',
    '$routeParams',
    'DocumentService'
  ];

  function DocumentDetailController(
      $location,
      $routeParams,
      DocumentService
    ) {
    var vm = this;

    DocumentService
      .query({documentId: $routeParams.documentId})
      .$promise
      .then(function success(response) {
        vm.doc = response;
      });
  }
})();
