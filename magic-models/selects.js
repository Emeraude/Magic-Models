var _ = require('lodash');
var tools = require('./tools');
comparisonOp = {
    'gt': '>',
    'gte': '>=',
    'lt': '<',
    'lte': '<=',
    'neq': '!=',
    'eq': '=',
    'not': 'NOT',
    'like': 'LIKE'
};

function where(orm, conditions) {
    _.each(conditions, function(value, field) {
	if (field.match(/^or$/i)) {
	    query += ' (';
	    _.each(value, function(val, i) {
		query += ' (';
		where(orm, val);
		query += ' )';
		for (key in value);
		if (i != key)
		    query += ' OR ';
	    });
	    query += ' )';
	}
	else {
	    if (typeof(value) != 'object')
		query += ' `' + field + '` = "' + orm.client.escape(value) + '"';
	    else if (value instanceof Array) {
		query += ' `' + field + '` IN (';
		_.each(value, function(val, i) {
		    query += tools.escapeValue(orm, val);
		    for (key in val);
		    if (i != key)
			query += ',';
		});
		query += ')';
	    }
	    else {
		_.each(value, function(val, condition) {
		    if (comparisonOp[condition])
			query += ' `' + field + '` ' + comparisonOp[condition] + ' ' + tools.escapeValue(orm, val);
		    else if (condition == 'between')
			query += ' `' + field + '` BETWEEN ' + tools.escapeValue(orm, val[0]) + ' AND ' + tools.escapeValue(orm, val[1]);
		    else if (condition == 'match') {
			if (val instanceof RegExp) {
			    val += '';
			    val = val.substring(1, val.length - 1 - (val[val.length - 1] != '/'))
			}
			query += ' `' + field + '` REGEXP ' + tools.escapeValue(orm, val);
		    }
		    for (key in value);
		    if (condition != key)
			query += ' AND';
		})
	    }
	    for (key in conditions);
	    if (field != key)
		query += ' AND';
	}
    });
}

function select(orm, model, options, callback) {
    query = 'SELECT';
    if (options.count == true)
	query += ' COUNT(*) AS count';
    else {
	if (!options.fields)
	    options.fields = _.keys(model.fields);
	if (typeof(options.fields) == 'string')
	    options.fields = [options.fields];
	_.each(options.fields, function(where) {
	    if (model.fields[where])
		query += ' `' + orm.client.escape(model.fields[where].fieldName) + '` AS `' + orm.client.escape(where) + '`,';
	    else
		console.warn('Warning: `' + orm.client.escape(where) + '` field is not defined in the model `' + orm.client.escape(model.name) + '`');
	});
	query = query.substring(0, query.length - 1);
    }
    query += ' FROM `' + model.table + '`';
    if (options.where) {
	query += ' WHERE';
	where(orm, options.where);
    }
    if (options.group) {
	query += ' GROUP BY';
	if (typeof(options.group) == 'string')
	    options.group = [options.group];
	_.each(options.group, function(group) {
	    query += ' `' + orm.client.escape(group) + '`,';
	});
	query = query.substring(0, query.length - 1);
    }
    if (options.order) {
	query += ' ORDER BY';
	_.each(options.order, function(order, field) {
	    query += ' `' + orm.client.escape(field) + '` ';
	    query +=  order.match(/^DESC$/i) ? 'DESC,' : 'ASC,';
	});
	query = query.substring(0, query.length - 1);
    }
    if (options.limit) {
	query += ' LIMIT ' + parseInt(options.limit);
	if (options.offset)
	    query += ' OFFSET ' + parseInt(options.offset);
    }
    orm.query(query, callback);
}

function typed(orm, model, options, callback, type) {
    if (callback == undefined) {
	callback = options;
	options = {};
    }
    if (type) {
	if (type == 'find')
	    options.limit = 1;
	else if (type == 'count')
	    options.count = true;
    }
    select(orm, model, options, callback);
}

module.exports.all = function(orm, model, options, callback) {
    typed(orm, model, options, callback);
}

module.exports.find = function(orm, model, options, callback) {
    typed(orm, model, options, callback, 'find');
}

module.exports.count = function(orm, model, options, callback) {
    typed(orm, model, options, callback, 'count');
}
