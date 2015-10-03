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

function or(conditions) {
  var query = '(';
  _.each(conditions, function(val) {
    query += '(' + module.exports(val) + ') OR ';
  });
  return query.substr(0, query.length - 4) + ')';
}

function _in(field, value) {
  var query = escape.fieldName(field) + ' IN (';
  _.each(value, function(val) {
    query += escape(value) + ',';
  });
  return query.substr(0, query.length - 1) + ')';
}

module.exports = function(conditions) {
  var query = '';

  _.each(conditions, function(val, field) {
    if (field == 'or')
      query += or(val);
    else if (val + '' != '[object Object]')
      query += escape.fieldName(field) + ' = ' + escape(val);
    else if (val instanceof Array)
      query += _in(field, value);
    else {
      _.each(val, function(val, type) {
	if (type in operators)
	  query += escape.fieldName(field) + ' ' + operators[type] + ' ' + escape(val);
	else if (type == 'between')
	  query += escape.fieldName(field) + ' BETWEEN ' + escape(val[0]) + ' AND ' + escape(val[1]);
	query += ' AND ';
      });
      query = query.split(/\ AND\ $/)[0];
    }
    query += ' AND ';
  });
  return query.split(/\ AND\ $/)[0];
}
