common.controller('UserProfileController', ['$scope', '$rootScope', 'Lightbox', 'toastr', 'user', 'dwPicWallService', 'userApi',
    function ($scope, $rootScope, Lightbox, toastr, user, dwPicWallService, userApi) {

    $scope.tab = 'activities';
    $scope.user = user;
    $scope.CONSTANT = CONSTANT;

    $scope.isVisitor = user.id === $rootScope.user.id;
    // Interactions
    $scope.switchTab = function(tab) {
        $scope.tab = tab;
    };



    $scope.resetMenu = function () {
        userApi.wxSetMenu().then(
            function (success) {
                console.log(success);
            },
            function (error) {
                console.log(error);
            }
        );
    };

    // pictures
    $scope.pictureReload = function () {
        dwPicWallService.getAllPictures($scope.user.id).then(
            function (data) {
                $scope.pics = angular.copy(data);
            }
        );
    };

    $scope.in_edit = false;
    $scope.changePic=function(index){
        if ($scope.in_edit) {
            var image = $scope.pics[index];
            image.selected = !image.selected;
        } else {
            Lightbox.openModal($scope.pics, index);
        }
    };
    $scope.showEdit = function () {
        $scope.in_edit = true;
    };
    $scope.cancelEdit = function () {
        angular.forEach($scope.pics, function (image, index) {
            image.selected = false;
        });
        $scope.in_edit = false;
    };
    $scope.deletePicture = function () {
        var delete_ids = [];
        angular.forEach($scope.pics, function (image, index) {
            if (image.selected) {
                delete_ids.push(image.id);
            }
        });

        if (delete_ids.length > 0) {
            dwPicWallService.deletePicture(delete_ids)
                .then(
                    function (res) {
                        toastr.success(res.deleted + ' 张照片已删除！');
                        $scope.pictureReload();
                    },
                    function (err) {
                        toastr.error('照片删除失败！');
                    }
                );
        }
    };
    $scope.pictureReload();

}]);