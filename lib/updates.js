var _ = require('lodash');
var tools = require('./tools');

function update(orm, model, params, callback) {
    query = 'UPDATE `' + orm.client.escape(model.table) + '` SET ';
    var atLeastOne = false;
    _.each(params.values, function(value, field) {
	if (model.fields[field]) {
	    query += '`' + orm.client.escape(model.fields[field].fieldName) + '` = ';
	    query += tools.escapeValue(orm, value);
	    if (field != _.findLastKey(params.values))
		query += ', ';
	    atLeastOne = true;
	}
    });
    if (model.modifiedAt)
	if (atLeastOne)
	    query += ', ';
	query += '`' + orm.client.escape(model.modifiedAt) + '` = NOW()';
    if (params.where) {
	query += ' WHERE';
	tools.where(orm, params.where);
    }
    orm.query(query, callback);
}

function manageUpdate(orm, model, params, callback) {
    _.each(model.fields, function(field, fieldName) {
	if (field.default.modified && params.values[fieldName] === undefined)
	    params.values[fieldName] = field.default.modified;
    });
    update(orm, model, params, callback);
}

module.exports.update = function(orm, model, params, callback) {
    // TODO : beforeValidate
    // TODO : validate
    var validation = tools.validate(orm, model, params.values);
    if (validation.length != 0) {
	callback({validationErrors: validation}, null);
	return ;
    }
    // TODO : afterValidate
    // TODO : beforeUpdate
    // TODO : beforeSave
    manageUpdate(orm, model, params, callback);
    // TODO : afterSave
    // TODO : afterUpdate
}
