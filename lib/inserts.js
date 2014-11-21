var _ = require('lodash');
var tools = require('./tools');

function insert(orm, model, values, callback) {
    query = 'INSERT INTO `' + orm.client.escape(model.table) + '`(';
    _.each(values, function(value, field) {
	if (model.fields[field]) {
	    query += orm.client.escape(model.fields[field].fieldName);
	    if (field != _.findLastKey(values))
		query += ', ';
	}
    });
    query += ') VALUES(';
    _.each(values, function(value, field) {
	query += tools.escapeValue(orm, value);
	if (field != _.findLastKey(values))
	    query += ', ';
    });
    query += ')';
    orm.query(query, callback);
}

module.exports.create = function(orm, model, values, callback) {
    // TODO : beforeValidate
    // TODO : validate
    var validation = tools.validate(orm, model, values);
    if (validation.length != 0) {
	callback({validationErrors: validation}, null);
	return ;
    }
    // TODO : afterValide
    // TODO : beforeCreate
    insert(orm, model, values, callback);
    // TODO : afterCreate
}
