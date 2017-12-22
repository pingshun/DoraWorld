dwControllers.controller('PicWallController', ['$state', '$scope', '$window', '$http', '$modal', 'test_str', 'dwPicWallService',
    function($state, $scope, $window, $http, $modal, test_str, dwPicWallService) {

        $scope.test_str = test_str;
        $scope.pics = [];

        dwPicWallService.getAllPictures()
            .then(
                function (data) {
                    $scope.pics = angular.copy(data);
                }
            );

    //点击图片时放大显示图片
    $scope.changePic=function($event){
        var img=$event.srcElement || $event.target;

        var w = angular.element($window);
        console.log(w);

        angular.element("#bigimage")[0].src=img.src;
        angular.element("#js-imgview")[0].style.display="block";
        angular.element("#js-imgview-mask")[0].style.display="block";
    }
    //点击图片时放小显示图片
    $scope.closePic =function(){
        angular.element("#js-imgview")[0].style.display="none";
        angular.element("#js-imgview-mask")[0].style.display="none";

    }

    $scope.addPicture = function () {
        $modal.open({
            templateUrl: '/templates/pic_wall/uploadPic.html',
            controller: 'UploadPicController'
        });
    }

}]);