var util = require('util');

module.exports = {
    random_string: function (len) {
        len = len || 32;
        var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var maxPos = $chars.length;
        var str = '';
        for (var i = 0; i < len; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    },
    inherits: function(child, base) {
        util.inherits(child, base);
        for (var property in base) {
            child[property] = base[property];
        }
    }
};