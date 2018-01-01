var viewBase = require('./view_base');
var util = require('./../utils/utils');

module.exports = ViewDwPicture;

function ViewDwPicture() {
    viewBase.call(ViewDwPicture);
};

util.inherits(ViewDwPicture, viewBase);

ViewDwPicture._table_name = 'v_dw_picture';