var dwUser = require('./../../models/dw_user'),
    userActivity = require('./../../models/user_activity'),
    encryptor  = require('./../../utils/encryptor');

module.exports = {
    getUserInfo: function (req, res, context) {
        console.log(context);
        var id = req.query.id;
        if (!id) {
            res.status(200).json({});
        }
        dwUser.getById(id, function (err, result) {
            if (err) {
                console.log(err);
                res.status(200).json({});
            } else {
                if (result) {
                    userActivity.getsByFields({user_id: result.id}, function (err, activities) {
                        if (err) {
                            result.activities = [];
                            res.status(200).json(result);
                        } else {
                            result.activities = activities;
                            res.status(200).json(result);
                        }
                    });
                } else {
                    res.status(200).json({});
                }
            }
        });
    },
    register: function (req, res, context) {
        console.log(context);

        dwUser.getsByFields({user_name: req.body.username}, function (err, result) {
            if (err) {
                console.log(err.message);
                res.send({
                    error: 1,
                    message: '未知错误',
                });
            } else {
                if (result && result.length > 0) {
                    res.send({
                        error: 1,
                        message: '用户名已经存在!',
                    });
                } else {
                    var user_data = {
                        user_name: req.body.username,
                        password: encryptor.createHash(req.body.password),
                        email: req.body.email
                    };
                    dwUser.createNew(user_data, function (err, result) {
                        if (err) {
                            console.log(err.message);
                            res.send({
                                error: 1,
                                message: '创建用户失败!',
                            });
                        } else {
                            var activity = {
                                user_id: result.insertId,
                                activity: "加入了 e漫 大家庭",
                            };
                            userActivity.createNew(activity);
                            res.send({
                                success: 1,
                                message: '创建用户成功'
                            });
                        }
                    });
                }
            }
        });
    },
    forgot_password: function (req, res, context) {
        console.log(context);


    }
};