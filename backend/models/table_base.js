var dbOperator      = require('../utils/db/dbOperator');

module.exports = TableBase;

function TableBase() {}

TableBase._table_name = '';

TableBase.preCreate = function(args) {};
TableBase.createNew = function(args, cb) {
    this.preCreate(args);
    dbOperator.create(this._table_name, args, cb);
};

TableBase.getById = function (id, cb) {
    dbOperator.query(this._table_name, {'id': id}, function(error, result) {
        if(cb) {
            cb(error, ((result && result.length > 0) ? result[0] : null ));
        }
    });
}

TableBase.getsAll = function (cb) {
    dbOperator.query(this._table_name, {}, cb);
}

TableBase.getsByFields = function (fields, cb) {
    dbOperator.query(this._table_name, fields, cb);
}

TableBase.deleteByIds = function (ids, cb) {
    dbOperator.delete_by_ids(this._table_name, ids, cb);
}