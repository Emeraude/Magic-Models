var _ = require('lodash');
var alias = require('./alias.js');
var escape = require('./escape.js');
var operators = {
  '>': 'gt',
  '>=': 'gte',
  '<': 'lt',
  '<=': 'lte',
  '!=': 'ne',
  '=': 'eq',
  'NOT': 'not',
  'LIKE': 'like',
  'REGEXP': 'match'
};

function or(conditions, aliases) {
  var query = '(';
  _.each(conditions, function(val) {
    query += '(' + module.exports(val, aliases) + ') OR ';
  });
  return query.substr(0, query.length - 4) + ')';
}

function _in(field, value, aliases) {
  var query = alias.fieldName(field, aliases) + ' IN(';
  _.each(value, function(val) {
    query += escape(val) + ', ';
  });
  return query.substr(0, query.length - 2) + ')';
}

module.exports = function(conditions, aliases) {
  var query = '';

  _.each(conditions, function(val, field) {
    if (field.toLowerCase() == 'or')
      query += or(val, aliases);
    else if (val instanceof Array)
      query += _in(field, val, aliases);
    else if (val + '' != '[object Object]')
      query += alias.fieldName(field, aliases) + ' = ' + escape(val);
    else {
      _.each(val, function(val, type) {
	if (type.toLowerCase() == 'between')
	  query += alias.fieldName(field, aliases) + ' BETWEEN ' + escape(val[0]) + ' AND ' + escape(val[1]) + ' AND ';
	else {
	  var op = _.findKey(operators, function(o) {
	    return o == type.toLowerCase();
	  });
	  if (op)
	    query += alias.fieldName(field, aliases) + ' ' + op + ' ' + escape(val) + ' AND ';
	}
      });
      query = query.split(/\ AND\ $/)[0];
    }
    query += ' AND ';
  });
  return query.split(/\ AND\ $/)[0];
}
