module.exports = function(app, security) {
    require('./pic_wall')(app, security);
    require('./common')(app, security);
    require('./account')(app, security);
    require('./mp')(app, security);
};
