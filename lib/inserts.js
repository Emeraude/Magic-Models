var _ = require('lodash');
var tools = require('./tools');

function insert(orm, model, values, callback) {
    query = 'INSERT INTO `' + orm.client.escape(model.table) + '`(';
    var queryFields = '';
    var queryValues = '';
    _.each(values, function(value, field) {
	if (model.fields[field]) {
	    queryFields += '`' + orm.client.escape(model.fields[field].fieldName) + '`';
	    queryValues += tools.escapeValue(orm, value);
	    if (field != _.findLastKey(values)) {
		queryFields += ', ';
		queryValues += ', ';
	    }
	}
    });
    query += queryFields + ') VALUES(' + queryValues;
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
    // TODO : afterValidate
    // TODO : beforeCreate
    insert(orm, model, values, callback);
    // TODO : afterCreate
}
