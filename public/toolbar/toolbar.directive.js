(function(window, document, undefined) {
  'use strict';
  angular
    .module('docsApp')
    .directive('docsToolbar', docsToolbar);

  function docsToolbar() {
    return {
      restrict: 'EA',
      require: '^ngModel',
      templateUrl: 'toolbar/toolbar.html',
      controller: 'ToolbarController',
      controllerAs: 'toolbar'
    };
  }
})();
