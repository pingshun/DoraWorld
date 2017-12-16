var dwUser = require('./../../models/dw_user')

module.exports = {
    getAccountInfo: function (req, res, context) {
        console.log(context);
        dwUser.getsAll(function (err, result) {
            if (err) {
                console.log(err);
                res.status(200).json([]);
            } else {
                res.status(200).json(result);
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
                        password: req.body.password,
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