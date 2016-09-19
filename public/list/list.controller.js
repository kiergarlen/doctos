/*global angular*/
(function(window, document) {
  'use strict';
  angular
    .module('docsApp')
    .controller('ListController', ListController);

  ListController.$inject = [
    '$location',
    'DocumentService'
  ];

  function ListController(
      $location,
      DocumentService
    ) {
    var vm = this;
    vm.results = DocumentService.get();
    vm.viewDocument = viewDocument;

    function viewDocument(id) {
      $location.path('document/view/' + id);
    }
  }
})();
