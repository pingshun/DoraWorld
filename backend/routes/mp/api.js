var crypto = require('crypto'),
    xml2js = require('xml2js'),
    path = require('path');

var config = require('./../../../config')

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
        if (verify_signature(req, res)) {
            var post_data = '';
            req.on('data', function (chunk) {
                post_data += chunk;
            });
            req.on('end', function () {
                xml2js.parseString(post_data, function (err, json) {
                    if (err) {
                        err.status = 400;
                        res.status(400).json({ message: 'XML parse error.' });
                    } else {
                        req.body = json;
                        console.log(json);

                        var msgType = json.xml.MsgType[0] ? json.xml.MsgType[0] : 'text';
                        switch (msgType) {
                            case 'text':
                                var msg = {
                                    "toUserName": json.xml.ToUserName[0],
                                    "fromUserName": json.xml.FromUserName[0],
                                    "createTime": json.xml.CreateTime[0],
                                    "msgType": json.xml.MsgType[0],
                                    "content": json.xml.Content[0],
                                    "msgId": json.xml.MsgId[0],
                                };
                                console.log(msg);

                                var time = Math.round(new Date().getTime() / 1000);
                                var funcFlag = 0;
                                var output = "" +
                                    "<xml>" +
                                    "<ToUserName><![CDATA[" + msg.fromUserName + "]]></ToUserName>" +
                                    "<FromUserName><![CDATA[" + msg.toUserName + "]]></FromUserName>" +
                                    "<CreateTime>" + time + "</CreateTime>" +
                                    "<MsgType><![CDATA[" + 'text' + "]]></MsgType>" +
                                    "<Content><![CDATA[" + 'This is a test' + "]]></Content>" +
                                    "<FuncFlag>" + funcFlag + "</FuncFlag>" +
                                    "</xml>";
                                res.type('xml');
                                res.send(output);
                                break;
                            case 'event':
                                res.type('string');
                                this.res.send('');
                                break;
                            case 'image':
                                res.type('string');
                                res.send('');
                                break;
                            case 'location':
                                res.type('string');
                                res.send('');
                                break;
                        }

                    }
                });
            });

        } else {
            res.status(401).json({ message: 'signature verify failed.' });
        }
    },

};