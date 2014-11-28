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

function surchargeInsert(orm, model, values, callback) {
    _.each(model.fields, function(field, fieldName) {
	if (field.default && values[fieldName] === undefined)
	    values[fieldName] = field.default;
    });
    function surcharged(errors, rows, infos) {
	if (infos && infos.insertId != 0 && model.primaryKey) {
	    rows = values;
	    rows[model.primaryKey] = infos.insertId;
	}
	callback(errors, rows, infos);
    }
    insert(orm, model, values, surcharged);
}

module.exports.create = function(orm, model, values, callback) {
    // TODO : beforeValidate
    var validation = tools.validate(orm, model, values);
    if (validation.length != 0) {
	callback({validationErrors: validation}, null);
	return ;
    }
    // TODO : afterValidate
    // TODO : beforeCreate
    surchargeInsert(orm, model, values, callback);
    // TODO : afterCreate
}
