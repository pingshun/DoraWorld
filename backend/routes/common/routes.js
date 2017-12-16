var api = require('./api');

module.exports = function(app, security) {
    app.get('/api/bootstrap_db', function(req, res) {
        api.bootStrapDb(req, res, '>>> bootstrap db !');
    });
};