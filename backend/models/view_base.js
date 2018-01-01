var tableBase = require('./table_base');
var util = require('./../utils/utils');

module.exports = ViewBase;

function ViewBase() {
    tableBase.call(ViewBase);
};

util.inherits(ViewBase, tableBase);

ViewBase._table_type = 'view';