/*global angular*/
(function(window, document) {
  'use strict';

  angular
    .module('docsApp')
    .directive('fileChange', fileChange);

  function fileChange() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        fileChange: '&'
      },
      link: function link(scope, element, attrs, ctrl) {
        element.on('change', onChange);

        scope.$on('destroy', function () {
          element.off('change', onChange);
        });

        function onChange() {
          attrs.multiple ? ctrl.$setViewValue(element[0].files) : ctrl.$setViewValue(element[0].files[0]);
          scope.$apply(function () {
            scope.fileChange();
          });
        }
      }
    };
  }
})();
