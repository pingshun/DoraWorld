var util = require('util');

module.exports = {
    random_string: function (len, type) {
        len = len || 32;
        type = type || 'regular';
        var chars = {
            regular: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            lower: 'abcdefghijklmnopqrstuvwxyz0123456789',
            hex: 'abcdef0123456789',
        };
        var $chars = chars[type] || chars.regular;
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