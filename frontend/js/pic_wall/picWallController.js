dwControllers.controller('PicWallController', ['$state', '$scope', '$window', '$http', '$uibModal', 'test_str', 'Lightbox', 'dwPicWallService', 'commonModalFactory',
    function($state, $scope, $window, $http, $uibModal, test_str, Lightbox, dwPicWallService, commonModalFactory) {

        $scope.test_str = test_str;
        $scope.pics = [];

        dwPicWallService.getAllPictures().then(
            function (data) {
                $scope.pics = angular.copy(data);
            }
        );

        //点击图片时放大显示图片
        $scope.changePic=function(index){
            Lightbox.openModal($scope.pics, index);
        }

        $scope.addPicture = function () {
            if ($scope.user && $scope.user.user_name) {
                $uibModal.open({
                    templateUrl: '/templates/pic_wall/uploadPic.html',
                    controller: 'UploadPicController'
                });
            } else {
                commonModalFactory.showSignInModal();
            }
        }

}]);