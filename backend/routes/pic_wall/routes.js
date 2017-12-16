var api = require('./api');

module.exports = function(app, security) {
    app.get('/api/pic_wall/gets_all', function(req, res) {
        api.getAllPics(req, res, '>>> get all pics');
    });
};