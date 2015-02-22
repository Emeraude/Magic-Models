var _ = require('lodash');
var uvrun = require('uvrun');

module.exports.describe = function(orm, model, callback) {
    function surcharged(errors, rows, infos) {
	var trueRows = {};
	_.each(rows, function(row) {
	    trueRows[row.Field] = row;
	    delete trueRows[row.Field].Field;
	});
	callback(errors, trueRows, infos);
    }
    orm.query('DESCRIBE ' + model.table, surcharged);
}

module.exports.describeAsync = function(orm, model) {
    var datas;
    this.describe(orm, model, function(e, r, i) {
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
