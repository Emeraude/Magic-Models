var _ = require('lodash');
var uvrun = require('uvrun-12');
var where = require('./where');

function _delete(orm, model, conditions, callback) {
    var query = 'DELETE FROM `' + orm.client.escape(model.table) + '`';
    if (_.size(conditions))
	query += ' WHERE' + where(orm, conditions);
    orm.query(query, callback);
}

module.exports.delete = function(orm, model, conditions, callback) {
    if (typeof(conditions) == 'function') {
	callback = conditions;
	conditions = {};
    }
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
