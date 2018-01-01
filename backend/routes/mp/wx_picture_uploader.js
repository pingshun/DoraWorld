const Q = require('q');

var wx_picture = require('./../../models/picture_from_wx');
var dw_picture = require('./../../models/dw_picture');

module.exports = {
    start: function (wx_user_id, start_time) {
        var defer = Q.defer();
        wx_picture.getsByFields({
            wx_user_id: wx_user_id,
            process_end: 0,
        }, function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
                if (result.length == 0) {
                    var process = {
                        wx_user_id: wx_user_id,
                        process_start: 1,
                        last_update: start_time,
                    };

                    wx_picture.createNew(process, function (err, result) {
                        if (error) {
                            defer.reject(err);
                        } else {
                            defer.resolve(1);
                        }
                    });
                } else {
                    var process = result[0];
                    process.process_start = 1;
                    process.last_update = start_time;
                    process.image_url = '';
                    process.process_end = 0;

                    wx_picture.updateById(process.id, process, function (error, result) {
                        if (error) {
                            defer.reject(err);
                        } else {
                            defer.resolve(1);
                        }
                    });
                }
            }
        });

        return defer.promise;
    },
    add_picture: function (wx_user_id, time, picture_url) {
        var defer = Q.defer();
        wx_picture.getsByFields({
            wx_user_id: wx_user_id,
            process_end: 0,
        }, function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
                if (result.length == 0) {
                    var error_message = '请按照上传图片的流程进行操作：首先发送"我要贴图"四个字的消息给我哦.';
                    defer.reject({
                        type: 1,
                        message: error_message
                    });
                } else {
                    var process = result[0];
                    process.last_update = time;
                    process.image_url = picture_url;
                    process.process_end = 1;

                    wx_picture.updateById(process.id, process, function (error, result) {
                        if (error) {
                            defer.reject(error);
                        } else {
                            var picture = {
                                uploader_id: wx_user_id,
                                file_name: picture_url,
                                from_wx: 1,
                            };
                            dw_picture.createNew(picture, function (err, result) {
                                if (error) {
                                    defer.reject(error);
                                } else {
                                    defer.resolve(1);
                                }
                            });
                        }
                    });
                }
            }
        });

        return defer.promise;
    }
};