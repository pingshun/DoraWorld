var dbOperator = require('./../../utils/db/dbOperator')

module.exports = {
    bootStrapDb: function (eq, res, context) {
        console.log(context);
        dbOperator.bootstrap(function(error, result) {
            res.send(result);
        });
    }
};