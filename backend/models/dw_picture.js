var tableBase = require('./table_base');
var util = require('./../utils/utils');

module.exports = DwPicture;

function DwPicture() {
    tableBase.call(DwPicture);
};

util.inherits(DwPicture, tableBase);

DwPicture._table_name = 'dw_picture';