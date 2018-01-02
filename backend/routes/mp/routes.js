var api = require('./api');

module.exports = function(app, security) {

    app.get('/mp/about', function (req, res) {
        api.show_about(req, res, '>>> show wx about page');
    });
    app.get('/mp/resetMenu', function (req, res) {
        security.adminRequired(req, res, function(req, res) {
            api.reset_menu(req, res, '>>>  reset mp menu');
        });
    });

    app.get('/api/mp/mp_interface', function (req, res) {
        api.interface_connect(req, res, '>>> verify mp token url');
    });
    app.post('/api/mp/mp_interface', function (req, res) {
        api.new_mp_message(req, res, '>>> get new mp message');
    });
};