var api = require('./api');

module.exports = function(app, security) {
    app.post('/api/mp/new_message', function(req, res){
        api.new_mp_message(req, res, '>>>  received new mp message');
    });
};