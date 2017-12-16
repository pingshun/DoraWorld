var tableBase = require('./table_base');
var util = require('./../utils/utils');

module.exports = DwUser;

function DwUser() {
    tableBase.call(DwUser);
};

util.inherits(DwUser, tableBase);

DwUser._table_name = 'dw_user';
