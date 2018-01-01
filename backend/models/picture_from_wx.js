var tableBase = require('./table_base');
var util = require('./../utils/utils');

module.exports = PictureFromWx;

function PictureFromWx() {
    tableBase.call(PictureFromWx);
};

util.inherits(PictureFromWx, tableBase);

PictureFromWx._table_name = 'picture_from_wx';