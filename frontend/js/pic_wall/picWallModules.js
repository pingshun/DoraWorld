dwModules.factory('dwPicWallApi', ['$http', 'promiseService', function($http, promiseService) {
    return {
        getAllPictures: function () {
            return promiseService.wrap(function(promise) {
                $http.get("/api/pic_wall/gets_all").then(
                    function (res) {
                        promise.resolve(res.data);
                    },
                    function (err) {
                        promise.reject(err);
                    }
                );
            });
        },
        uploadPicture: function (file, message) {
            return promiseService.wrap(function(promise) {
                var data = new FormData();
                data.append('image', file);
                data.append('msssage', message);
                $http({
                    method: 'post',
                    enctype: "multipart/form-data",
                    url: CONSTANT.HOST + 'api/pic_wall/upload_pic',
                    data:data,
                    headers: {'Content-Type': undefined},
                }).success(function(data) {
                    promise.resolve(data);
                }).error(function (err) {
                    promise.reject(err);
                })
            });
        }
    };
}]);

dwModules.provider('dwPicWallService', ['$httpProvider', function() {
    return {
        $get: ['dwPicWallApi', 'promiseService', function(dwPicWallApi, promiseService) {
            return {
                getAllPictures: function () {
                    return promiseService.wrap(function(promise) {
                        dwPicWallApi.getAllPictures().then(
                            function (data) {
                                promise.resolve(data);
                            },
                            function (err) {
                                promise.reject(err);
                            }
                        );
                    });
                },
                uploadPicture: function (file, message) {
                    return promiseService.wrap(function(promise) {
                        dwPicWallApi.uploadPicture(file, message)
                            .then(function(res) {
                                if(res.success) {
                                    promise.resolve();
                                } else {
                                    promise.reject({
                                        error_message: {
                                            type: 'danger',
                                            text: '上传照片失败！'
                                        }
                                    });
                                }
                            }, function(err) {
                                promise.reject({
                                    error_message: {
                                        type: 'danger',
                                        text: '上传照片失败！'
                                    }
                                });
                            });
                    });
                }
            };
        }],
    };
}]);
