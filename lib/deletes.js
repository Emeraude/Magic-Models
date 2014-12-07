var uvrun = require('uvrun');
var tools = require('./tools');

function delet(orm, model, conditions, callback) {
    query = 'DELETE FROM `' + orm.client.escape(model.table) + '` WHERE';
    tools.where(orm, conditions);
    orm.query(query, callback);
}

module.exports.delete = function(orm, model, conditions, callback) {
    model.beforeDelete(conditions, function(conditions) {
	delet(orm, model, conditions, function(e, r, i) {
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
