var _ = require('lodash');
var comparisonOp = {
    'gt': '>',
    'gte': '>=',
    'lt': '<',
    'lte': '<=',
    'ne': '!=',
    'eq': '=',
    'not': 'NOT',
    'like': 'LIKE'
};
var tools = require('./tools');

function _or(orm, value) {
    var query = ' (';
    _.each(value, function(val, i) {
	query += ' (';
	query += _where(orm, val);
	query += ' ) OR ';
    });
    query = query.substring(0, query.length - 4);
    query += ' )';
    return query;
}

function _in(orm, field, value) {
    var query = ' `' + field + '` IN (';
    _.each(value, function(val, i) {
	query += tools.escapeValue(orm, val);
	query += ',';
    });
    query = query.substring(0, query.length - 1);
    query += ')';
    return query;
}

function _match(orm, field, value) {
    if (value instanceof RegExp) {
	value += '';
	value = value.substring(1, value.length - 1 - (value[value.length - 1] != '/'))
    }
    return ' `' + field + '` REGEXP ' + tools.escapeValue(orm, value);
}

function _where(orm, conditions) {
    var query = '';
    _.each(conditions, function(value, field) {
	if (field.match(/^or$/i))
	    query += _or(orm, value);
	else {
	    if (typeof(value) != 'object')
		query += ' `' + field + '` = "' + orm.client.escape(value + '') + '"';
	    else if (value instanceof Array)
		query += _in(orm, field, value);
	    else {
		_.each(value, function(val, condition) {
		    if (comparisonOp[condition])
			query += ' `' + field + '` ' + comparisonOp[condition] + ' ' + tools.escapeValue(orm, val);
		    else if (condition == 'between')
			query += ' `' + field + '` BETWEEN ' + tools.escapeValue(orm, val[0]) + ' AND ' + tools.escapeValue(orm, val[1]);
		    else if (condition == 'match')
			query += _match(orm, field, val);
		    for (key in value);
		    if (condition != key)
		    	query += ' AND';
		});
	    }
	}
	for (key in conditions);
	if (field != key)
	    query += ' AND';
    });
    return query;
}

module.exports = _where;
