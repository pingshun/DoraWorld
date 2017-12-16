var api = require('./api');

module.exports = function(app, security) {
    app.get('/api/account/get_account', function(req, res) {
        security.authenticationRequired(req, res, function(req, res) {
            api.getAccountInfo(req, res, '>>> get account info !');
        });
    });
    app.post('/api/account/register', function(req, res){
        api.register(req, res, '>>> register user');
    });
    app.post('/api/account/forgot_password', function(req, res){
        api.forgot_password(req, res, '>>> forgot password: user[' + req.body.user_name + ']');
    });
};