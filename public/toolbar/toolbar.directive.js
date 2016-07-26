/*global angular*/
(function(window, document) {
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
