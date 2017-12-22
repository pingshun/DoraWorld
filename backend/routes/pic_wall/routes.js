var api = require('./api');
var multer  = require('multer');
var config = require('./../../../config');

var upload = multer({dest: config.server.upload_dir});

module.exports = function(app, security) {
    app.get('/api/pic_wall/gets_all', function(req, res) {
        api.getAllPics(req, res, '>>> get all pics');
    });

    app.post('/api/pic_wall/upload_pic', upload.single('image'), function (req, res) {
        security.authenticationRequired(req, res, function(req, res) {
            api.uploadPicture(req, res, '>>> upload a picture');
        });
    })
};