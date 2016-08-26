/*global angular*/
(function(window, document) {
  'use strict';
  angular
    .module('docsApp')
    .controller('SearchController', SearchController);

  SearchController.$inject = [
    '$mdDialog', 'SearchService'
  ];

  function SearchController($mdDialog, SearchService) {
    var vm = this;
    vm.term = '';
    vm.results = [];
    vm.isLoading = false;
    vm.submit = submit;
    vm.viewDocument = viewDocument;

    function submit() {
      vm.isLoading = true;
      if (vm.term.length < 2) {
        $mdDialog.show(
          $mdDialog.alert()
            .title('Atención')
            .textContent('Debe ingresar un término de búsqueda válido')
            .ariaLabel('Ventana de diálogo')
            .ok('Aceptar')
        );
        vm.term = '';
        vm.results = [].slice();
        vm.isLoading = false;
      } else {
        SearchService
          .query({term: vm.term})
          .$promise
          .then(function success(response) {
            vm.isLoading = false;
            vm.results = response;
          });
      }
    }

    function viewDocument(id) {
      console.log(id);
      return id;
    }
  }
})();
