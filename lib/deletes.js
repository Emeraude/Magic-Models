var uvrun = require('uvrun');
var where = require('./where');

function _delete(orm, model, conditions, callback) {
    orm.query('DELETE FROM `' + orm.client.escape(model.table) + '` WHERE'
	      + where(orm, conditions), callback);
}

module.exports.delete = function(orm, model, conditions, callback) {
    model.beforeDelete(conditions, function(conditions) {
	_delete(orm, model, conditions, function(e, r, i) {
	    model.afterDelete(e, r, i, callback);
	});
    });
}

module.exports.deleteAsync = function(orm, model, values) {
    var datas;
    this.delete(orm, model, values, function(e, r, i) {
	datas = {
	    errors: e,
	    rows: r,
	    infos: i
	};
    });
    while (!datas)
	uvrun.runOnce();
    return datas;
}
