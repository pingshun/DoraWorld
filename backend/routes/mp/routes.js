var api = require('./api');

module.exports = function(app, security) {

    app.get('/api/mp/new_message', function(req, res){
        api.new_mp_message(req, res, '>>>  received new mp message');
    });
    app.get('/api/mp/verify_signature', function (req, res) {
        api.verify_signature(req, res, '>>> verify mp token url');
    });
};