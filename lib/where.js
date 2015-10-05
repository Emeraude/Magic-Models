var _ = require('lodash');
var escape = require('./escape.js');
var operators = {
  'gt': '>',
  'gte': '>=',
  'lt': '<',
  'lte': '<=',
  'ne': '!=',
  'eq': '=',
  'not': 'NOT',
  'like': 'LIKE',
  'match': 'REGEXP'
};

function fieldName(field, aliases) {
  if (aliases && aliases[field])
    return escape.fieldName(aliases[field].fieldName);
  return escape.fieldName(field);
}

function or(conditions, aliases) {
  var query = '(';
  _.each(conditions, function(val) {
    query += '(' + module.exports(val, aliases) + ') OR ';
  });
  return query.substr(0, query.length - 4) + ')';
}

function _in(field, value, aliases) {
  var query = fieldName(field, aliases) + ' IN(';
  _.each(value, function(val) {
    query += escape(val) + ', ';
  });
  return query.substr(0, query.length - 2) + ')';
}

module.exports = function(conditions, aliases) {
  var query = '';

  _.each(conditions, function(val, field) {
    if (field == 'or')
      query += or(val, aliases);
    else if (val instanceof Array)
      query += _in(field, val, aliases);
    else if (val + '' != '[object Object]')
      query += fieldName(field, aliases) + ' = ' + escape(val);
    else {
      _.each(val, function(val, type) {
	if (type in operators)
	  query += fieldName(field, aliases) + ' ' + operators[type] + ' ' + escape(val);
	else if (type == 'between')
	  query += fieldName(field, aliases) + ' BETWEEN ' + escape(val[0]) + ' AND ' + escape(val[1]);
	query += ' AND ';
      });
      query = query.split(/\ AND\ $/)[0];
    }
    query += ' AND ';
  });
  return query.split(/\ AND\ $/)[0];
}
