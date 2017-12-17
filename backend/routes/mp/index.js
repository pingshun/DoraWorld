module.exports = function(app, security) {
    require('./routes')(app, security);
};