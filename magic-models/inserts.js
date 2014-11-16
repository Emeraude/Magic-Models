var _ = require('lodash');
var tools = require('./tools');

function insert(orm, model, options, callback) {
    query = 'INSERT INTO `' + orm.client.escape(model.table) + '`(';
    _.each(options, function(value, field) {
	if (model.fields[field]) {
	    query += orm.client.escape(model.fields[field].fieldName);
	    if (field != _.findLastKey(options))
		query += ', ';
	}
    });
    query += ') VALUES(';
    _.each(options, function(value, field) {
	query += tools.escapeValue(orm, value);
	if (field != _.findLastKey(options))
	    query += ', ';
    });
    query += ')';
    orm.query(query, callback);
}

module.exports.create = function(orm, model, options, callback) {
    // TODO : beforeValidate
    // TODO : validate
    // TODO : afterValide
    // TODO : beforeCreate
    insert(orm, model, options, callback);
    // TODO : afterCreate
}
