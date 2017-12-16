common.directive('busy', [function() {
    return {
        restrict: 'A',
        template: '<button class="btn btn-sm" ng-click="click()" ng-disabled="disabled() || isBusy"> <span ng-if="isBusy"><i ng-class="icon"></i></span> <span ng-transclude></span> </button>',
        replace: true,
        transclude: true,
        scope: {
            busy: '&',
            busyIcon: '@',
            busyDisabled: '&'
        },
        link: function(scope, element, attrs) {
            scope.isBusy = false;
            scope.icon = scope.busyIcon || 'fa fa-spinner fa-spin';
            scope.disabled = scope.busyDisabled || function () {
                    return false;
                };

            scope.click = function() {
                var promise = scope.busy();
                if (typeof promise == 'object' && typeof promise.finally == 'function') {
                    scope.isBusy = true;
                    promise.finally(function () {
                        scope.isBusy = false;
                    });
                }
            }
        }
    }
}]);