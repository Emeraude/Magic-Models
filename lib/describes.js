var _ = require('lodash');

module.exports.describe = function(orm, model, conditions, callback) {
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
