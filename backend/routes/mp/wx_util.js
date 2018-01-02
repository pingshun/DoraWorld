var https = require('https');
var wechatApi = require('wechat-api');
var Q = require('q');

var config = require('./../../../config');

var api = new wechatApi(config.mp.id, config.mp.secret, function () {
    return global.wx_access_token;
});

module.exports = {
    getWxToken: function () {
        var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&";
        url += "appid=" + config.mp.id + "&secret=" + config.mp.secret;

        https.get(url, function (res) {
            var datas = [];
            var size = 0;
            res.on('data', function (data) {
                datas.push(data);
                size += data.length;
            });
            res.on("end", function () {
                var buff = Buffer.concat(datas, size);
                var token = JSON.parse(buff.toString());

                console.log(token.access_token);
                console.log(token.expires_in);

                global.wx_access_token = token.access_token;
            });
        }).on("error", function (err) {
            Logger.error(err.stack);
        });
    },
    
    resetWxMenu: function () {
        var menu = {
            "button":[
                {
                    "type":"click",
                    "name":"今日歌曲",
                    "key":"V1001_TODAY_MUSIC"
                },
                {
                    "name":"菜单",
                    "sub_button":[
                        {
                            "type":"view",
                            "name":"搜索",
                            "url":"http://www.soso.com/"
                        },
                        {
                            "type":"click",
                            "name":"赞一下我们",
                            "key":"V1001_GOOD"
                        }]
                }]
        };


        var defer = Q.defer();
        api.createMenu(menu, function (error, data, result) {
            console.log('aaa');
            if (!error) {
                defer.resolve('success');
            } else {
                console.log(error);
                defer.reject('error');
            }
        });

    }
};