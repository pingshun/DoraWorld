var crypto = require('crypto'),

    config = require('../../config'),
    util = require('./utils');

var encryptor = {
    createHash: function(secret) {
        var salt = util.random_string(config.security.salt_length, 'hex');
        var hash = this.getMd5(secret + salt.toLowerCase());
        return salt + hash;
    },
    validateHash: function(hash, secret) {
        var salt = hash.substr(0, config.security.salt_length);
        var validHash = salt + this.getMd5(secret + salt);
        return hash === validHash;
    },
    getMd5: function(string) {
        return crypto.createHash('sha1').update(string).digest('hex');
    },
};

module.exports = encryptor;