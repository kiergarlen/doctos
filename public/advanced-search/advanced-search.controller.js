/*global angular*/
(function(window, document) {
  'use strict';
  angular
    .module('docsApp')
    .controller('AdvancedSearchController', AdvancedSearchController);

  AdvancedSearchController.$inject = [
    '$mdDialog', 'SearchService'
  ];

  function AdvancedSearchController($mdDialog, SearchService) {
    var vm = this;
    vm.term = '';
    vm.results = [];
    vm.submit = submit;

    function submit() {
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
      } else {
        SearchService
          .query({term: vm.term})
          .$promise
          .then(function success(response) {
            vm.results = response;
          });
      }
    }
  }
})();
