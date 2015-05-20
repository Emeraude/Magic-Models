var _ = require('lodash');
var uvrun = require('uvrun-12');
var tools = require('./tools');
var where = require('./where');

function update(orm, model, params, callback) {
    var query = 'UPDATE `' + orm.client.escape(model.table) + '` SET ';
    var atLeastOne = false;
    _.each(params.values, function(value, field) {
	if (model.fields[field]) {
	    if (atLeastOne)
		query += ', ';
	    query += '`' + orm.client.escape(model.fields[field].fieldName) + '` = ';
	    query += tools.escapeValue(orm, value);
	    atLeastOne = true;
	}
    });

    if (model.modifiedAt) {
	if (atLeastOne)
	    query += ', ';
	query += '`' + orm.client.escape(model.modifiedAt) + '` = NOW()';
    }
    if (params.where)
	query += ' WHERE' + where(orm, params.where);
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
    if (typeof(params) == 'function') {
	callback = params;
	params = {values: {}};
    }
    if (params.values === undefined)
	params.values = {};
    model.beforeValidate(params, function(params) {
	tools.validate(orm, model, params.values, [], function(d, e) {
	    if (!d)
		callback({validationErrors: e});
	    else {
		model.afterValidate(params.values, function(values) {
		    params.values = values;
		    model.beforeUpdate(params.values, function(values) {
			params.values = values;
			model.beforeSave(params.values, function(values) {
			    params.values = values;
			    manageUpdate(orm, model, params, function(e, r, i) {
				model.afterSave(e, r, i, function(e, r, i) {
				    model.afterUpdate(e, r, i, callback);
				});
			    });
			});
		    });
		});
	    }
	});
    });
}

module.exports.updateAsync = function(orm, model, values) {
    var datas;
    this.update(orm, model, values, function(e, r, i) {
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
