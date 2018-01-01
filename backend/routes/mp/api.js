var crypto = require('crypto'),
    xml2js = require('xml2js'),
    path = require('path');


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
        var echostr = req.query.echostr;

        if (verify_signature(req, res)) {
            res.send(echostr);
        } else {
            res.status(401).json({ message: 'signature verify failed.' });
        }
    },
    new_mp_message: function (req, res, context) {
        console.log(context);
        //检验 token
        wechat.checkSignature(req, res);
        //预处理
        wechat.handler(req, res);



        wechat.on('image', function(session) {
            session.replyNewsMsg([{
                Title: '新鲜事',
                Description: '点击查看今天的新鲜事',
                PicUrl: 'http://www.dora-world.cn/images/pic_wall/1514787765625.jpg',
                Url: 'http://www.dora-world.cn/images/pic_wall/1514787765625.jpg'
            }]);
        });

    },

};