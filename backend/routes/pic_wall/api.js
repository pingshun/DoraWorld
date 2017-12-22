var path = require('path'),
    fs = require('fs');

var config = require('./../../../config'),
    utils = require('./../../utils/utils'),
    dwPicture = require('./../../models/dw_picture');

module.exports = {
    getAllPics: function (req, res, context) {
        console.log(context);

        dwPicture.getsAll(function (error, result) {
            if (error) {
                res.status(500).json({error: 'Internal Server Error'});
            } else {
                res.status(200).json(result);
            }
        });
    },
    uploadPicture: function (req, res, context) {
        console.log(context);

        var file = req.file;
        var name_sections =(file.originalname).split(".");
        var file_name = (new Date()).valueOf() + '.' + name_sections[name_sections.length - 1];

        dwPicture.createNew(
            {
                uploader: req.user.user_name,
                file_name: file_name,
                message: req.body.message,
            },
            function (error, result) {
                if (error) {
                    res.status(500).json({error: 'Internal Server Error'});
                } else {
                    var full_name = path.join(config.server.fe_folder, 'images', 'pic_wall', file_name);

                    fs.writeFileSync(full_name, fs.readFileSync(file.path));
                    fs.unlinkSync(file.path);

                    res.status(200).json({success: 1});
                }
            }
        );
    }
};