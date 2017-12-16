dwControllers.controller('HomePageController', ['$state', '$scope', function($state, $scope) {

    $scope.toAlbums = function() {
        $state.go('albums');
    };
    $scope.join = function() {
        //frameworkModalFactory.showSignInModal();
    };
}]);