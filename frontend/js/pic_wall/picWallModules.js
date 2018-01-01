dwModules.factory('dwPicWallApi', ['$http', 'promiseService', function($http, promiseService) {
    return {
        getAllPictures: function (user_id) {
            return promiseService.wrap(function(promise) {
                var url = "/api/pic_wall/gets_all";
                if (user_id) {
                    url += "?user_id=" + user_id;
                }
                $http.get(url).then(
                    function (res) {
                        promise.resolve(res.data);
                    }, promise.reject);
            });
        },
        uploadPicture: function (file, message) {
            return promiseService.wrap(function(promise) {
                var data = new FormData();
                data.append('image', file);
                data.append('message', message);

                $http({
                    method: 'post',
                    enctype: "multipart/form-data",
                    url: CONSTANT.HOST + 'api/pic_wall/upload_pic',
                    data:data,
                    headers: {'Content-Type': undefined},
                }).then(function(res) {
                    promise.resolve(res.data);
                }, promise.reject);
            });
        },
        deletePicture: function (ids) {
            return promiseService.wrap(function(promise) {
                var data = {delete_ids: ids};

                $http({
                    method: 'post',
                    url: CONSTANT.HOST + 'api/pic_wall/delete_pic',
                    data: data,
                }).then(function (res) {
                    promise.resolve(res.data);
                }, promise.reject);
            });
        }
    };
}]);

dwModules.provider('dwPicWallService', ['$httpProvider', function() {
    return {
        $get: ['dwPicWallApi', 'promiseService', function(dwPicWallApi, promiseService) {
            return {
                getAllPictures: function (user_id) {
                    return promiseService.wrap(function(promise) {
                        dwPicWallApi.getAllPictures(user_id).then(
                            function (data) {
                                angular.forEach(data, function (image, index) {
                                   data[index]['url'] = 'images/pic_wall/' + image.file_name;
                                   data[index]['caption'] = image.message;
                                });
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
                },
                deletePicture: function (ids) {
                    return promiseService.wrap(function(promise) {
                        dwPicWallApi.deletePicture(ids)
                            .then(function(res) {
                                if(res.success) {
                                    promise.resolve(res);
                                } else {
                                    promise.reject({
                                        error_message: {
                                            type: 'danger',
                                            text: '删除照片失败！'
                                        }
                                    });
                                }
                            }, function(err) {
                                promise.reject({
                                    error_message: {
                                        type: 'danger',
                                        text: '删除照片失败！'
                                    }
                                });
                            });
                    });
                }
            };
        }],
    };
}]);
