var tableBase = require('./table_base');
var util = require('./../utils/utils');

module.exports = UserActivity;

function UserActivity() {
    tableBase.call(UserActivity);
};

util.inherits(UserActivity, tableBase);

UserActivity._table_name = 'user_activity';