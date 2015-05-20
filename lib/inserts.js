var _ = require('lodash');
var uvrun = require('uvrun-12');
var tools = require('./tools');

function insert(orm, model, values, callback) {
    var query = 'INSERT INTO `' + orm.client.escape(model.table) + '`(';
    var queryFields = '';
    var queryValues = '';
    _.each(values, function(value, field) {
	if (model.fields[field]) {
	    if (queryFields != '') {
		queryFields += ', ';
		queryValues += ', ';
	    }
	    queryFields += '`' + orm.client.escape(model.fields[field].fieldName) + '`';
	    queryValues += tools.escapeValue(orm, value);
	}
    });

    function defaultValues(type) {
	if (model[type + 'At']) {
	    if (queryFields != '') {
		queryFields += ', ';
		queryValues += ', ';
	    }
	    queryFields += '`' + orm.client.escape(model[type + 'At']) + '`';
	    queryValues += 'NOW()';
	}
    }
    defaultValues('created');
    defaultValues('modified');

    query += queryFields + ') VALUES(' + queryValues + ')';
    orm.query(query, callback);
}

function surchargeInsert(orm, model, values, callback) {
    _.each(model.fields, function(field, fieldName) {
	if (field.default.created && values[fieldName] === undefined)
	    values[fieldName] = field.default.created;
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
    if (typeof(values) == 'function') {
	callback = values;
	values = {};
    }
    model.beforeValidate(values, function(values) {
	tools.validateAll(orm, model, values, function(d, e) {
	    if (!d)
		callback({validationErrors: e})
	    else {
		model.afterValidate(values, function(values) {
		    model.beforeCreate(values, function(values) {
			model.beforeSave(values, function(values) {
			    surchargeInsert(orm, model, values, function(e, r, i) {
				model.afterSave(e, r, i, function(e, r, i) {
				    model.afterCreate(e, r, i, callback);
				});
			    });
			});
		    });
		});
	    }
	});
    });
}

module.exports.createAsync = function(orm, model, values) {
    var datas;
    this.create(orm, model, values, function(e, r, i) {
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
