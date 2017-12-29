var dwControllers = angular.module('dw.controllers', ['bootstrapLightbox', 'dw.modules']);
var dwModules = angular.module('dw.modules', []);

dwControllers.config(['LightboxProvider', function (LightboxProvider) {
    // set a custom template
    LightboxProvider.templateUrl = '/templates/common/lightbox/template.html';
}]);