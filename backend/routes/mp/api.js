var path = require('path');
var wx_uploader = require('./wx_picture_uploader');


var config = require('./../../../config');

var wechat = require('node-wechat')(config.mp.token);

var verify_signature = function (req, res) {

    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;


    /*  加密/校验流程如下： */
    //1. 将token、timestamp、nonce三个参数进行字典序排序
    var array = new Array();
    array[0] = config.mp.token;
    array[1] = timestamp;
    array[2] = nonce;
    array.sort();
    var str = array.join('');

    //2. 将三个参数字符串拼接成一个字符串进行sha1加密
    var sha1Code = crypto.createHash("sha1");
    var code = sha1Code.update(str,'utf-8').digest("hex");

    //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信

    return code === signature;
}

module.exports = {
    show_about: function (req, res, context) {
        console.log(context);
        res.sendFile('about.html', { root: path.join(config.server.fe_folder, 'wx'), title: 'express' });
    },
    interface_connect: function (req, res, context) {
        console.log(context);

        wechat.checkSignature(req,res);
    },
    new_mp_message: function (req, res, context) {
        console.log(context);
        //检验 token
        wechat.checkSignature(req, res);
        //预处理
        wechat.handler(req, res);

        //监听文本信息
        wechat.text(function (data) {

            //console.log(data.ToUserName);
            //console.log(data.FromUserName);
            //console.log(data.CreateTime);
            //console.log(data.MsgType);
            //...

            /*var msg = {
                FromUserName : data.ToUserName,
                ToUserName : data.FromUserName,
                MsgType : "text",
                Title : "宋冬野",
                Description : "宋冬野——摩登天空7",
                Content : "这是地址回复"
            }

            //回复信息
            wechat.send(msg);*/

            if (data.Content === "我要贴图") {
                var success = wx_uploader.start(data.FromUserName, data.CreateTime);
                console.log(success);

                var replay_message =  success ?
                    "好的，下面请在5分钟内将你要贴的照片，发送给我." :
                    "十分抱歉，e漫服务器出现错误，请稍后重试!";
                var msg = {
                    FromUserName : data.ToUserName,
                    ToUserName : data.FromUserName,
                    MsgType : "text",
                    Content : replay_message
                }
                //回复信息
                wechat.send(msg);
            } else {
                res.send('');
            }
        });

        //监听图片信息
        wechat.image(function (data) {
            console.log(data);
            var replay_message = wx_uploader.add_picture(data.FromUserName, data.CreateTime, data.PicUrl);
            var msg = {
                FromUserName : data.ToUserName,
                ToUserName : data.FromUserName,
                MsgType : "text",
                Content : replay_message
            }
            //回复信息
            wechat.send(msg);
        });

        wechat.all(function (data) {
            res.send('');
        })
    },

};