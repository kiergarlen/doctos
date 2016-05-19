//login.js
angular
  .module('docs.login')
  .directive('docsLogin', login);

//login.directive.js
angular
  .module('docsApp.login')
  .directive('docsLogin', docsLogin);
/**
 * @name docsLogin
 * @desc Directiva para menú principal
 */
function docsLogin() {
  return {
    restrict: 'EA',
    require: '^ngModel',
    templateUrl: 'login.html',
    controller: 'LoginController',
    controllerAs: 'login'
  };
}
