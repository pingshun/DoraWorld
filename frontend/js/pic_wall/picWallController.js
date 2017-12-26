dwControllers.controller('PicWallController', ['$state', '$scope', '$window', '$http', '$modal', 'test_str', 'dwPicWallService', 'commonModalFactory',
    function($state, $scope, $window, $http, $modal, test_str, dwPicWallService, commonModalFactory) {

        $scope.test_str = test_str;
        $scope.pics = [];
        $scope.in_full_mode = 0;

        var w = angular.element($window);
        w.on('resize', function() {
            if ($scope.in_full_mode) {
                var image_divs = angular.element("#js-imgview");
                var image_eles = angular.element("#bigimage");

                if (image_divs.length > 0 && image_eles.length > 0) {
                    $scope.resizeImage(image_divs[0], image_eles[0]);
                }
            }
        });

        dwPicWallService.getAllPictures().then(
            function (data) {
                $scope.pics = angular.copy(data);
            }
        );

        //点击图片时放大显示图片
        $scope.changePic=function($event){
            var img=$event.srcElement || $event.target;

            var image_divs = angular.element("#js-imgview");
            var image_eles = angular.element("#bigimage");

            if (image_divs.length > 0 && image_eles.length > 0) {
                image_eles[0].src=img.src;
                image_divs[0].style.display="block";
                angular.element("#js-imgview-mask")[0].style.display="block";

                $scope.resizeImage(image_divs[0], image_eles[0]);
                $scope.in_full_mode = 1;
            }

        }
        //点击图片时放小显示图片
        $scope.closePic =function(){
            angular.element("#js-imgview")[0].style.display="none";
            angular.element("#js-imgview-mask")[0].style.display="none";
            $scope.in_full_mode = 0;
        }

        $scope.resizeImage = function(image_div, image_element) {
            var window = angular.element($window);

            var widthMargin		= 100,
                heightMargin 	= 100,

                windowH      	= window.height() - heightMargin,
                windowW      	= window.width() - widthMargin,

                theImage     	= new Image();
                theImage.src    = image_element.src;

            var imgwidth     	= theImage.width,
                imgheight    	= theImage.height;

            if((imgwidth > windowW) || (imgheight > windowH)) {
                if(imgwidth > imgheight) {
                    var newwidth 	= windowW,
                        ratio 		= imgwidth / windowW,
                        newheight 	= imgheight / ratio;

                    theImage.height = newheight;
                    theImage.width	= newwidth;

                    if(newheight > windowH) {
                        var newnewheight 	= windowH,
                            newratio 		= newheight/windowH,
                            newnewwidth 	= newwidth/newratio;

                        theImage.width 		= newnewwidth;
                        theImage.height		= newnewheight;
                    }
                } else {
                    var newheight 	= windowH,
                        ratio 		= imgheight / windowH,
                        newwidth 	= imgwidth / ratio;

                    theImage.height = newheight;
                    theImage.width	= newwidth;

                    if(newwidth > windowW) {
                        var newnewwidth 	= windowW,
                            newratio 		= newwidth/windowW,
                            newnewheight 	= newheight/newratio;

                        theImage.height 	= newnewheight;
                        theImage.width		= newnewwidth;
                    }
                }
            }

            image_div.style.width = theImage.width + 'px';
            image_div.style.height = theImage.height + 'px';

            image_element.style.width = theImage.width + 'px';
            image_element.style.height = theImage.height + 'px';

        };

        $scope.addPicture = function () {
            if ($scope.user && $scope.user.user_name) {
                $modal.open({
                    templateUrl: '/templates/pic_wall/uploadPic.html',
                    controller: 'UploadPicController'
                });
            } else {
                commonModalFactory.showSignInModal();
            }
        }

}]);