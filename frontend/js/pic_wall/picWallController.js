dwControllers.controller('PicWallController', ['$state', '$scope', '$window', '$http', '$uibModal', 'toastr', 'test_str', 'Lightbox', 'dwPicWallService', 'commonModalFactory',
    function($state, $scope, $window, $http, $uibModal, toastr, test_str, Lightbox, dwPicWallService, commonModalFactory) {

        $scope.test_str = test_str;
        $scope.pics = [];
        $scope.in_edit = false;
        $scope.CONSTANT = CONSTANT;

        $scope.pictureReload = function () {
            dwPicWallService.getAllPictures().then(
                function (data) {
                    $scope.pics = angular.copy(data);
                }
            );
        }

        //点击图片时放大显示图片
        $scope.changePic=function(index){
            if ($scope.in_edit) {
                var image = $scope.pics[index];
                image.selected = !image.selected;
            } else {
                Lightbox.openModal($scope.pics, index);
            }
        }

        $scope.showPicMenu = function(index, shown) {
            var picture = $scope.pics[index];
            var menu_div = angular.element("#checkbox_pic_" + picture.id)[0];
            if (menu_div) {
                menu_div.style.display = shown ? "block" : "none";
            }
        }

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
        }
        $scope.showEdit = function () {
            $scope.in_edit = true;
        }
        $scope.cancelEdit = function () {
            angular.forEach($scope.pics, function (image, index) {
                image.selected = false;
            });
            $scope.in_edit = false;
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

        $scope.pictureReload();

        $scope.$on('dw::picture::add', function() {
            $scope.pictureReload();
        });

}]);