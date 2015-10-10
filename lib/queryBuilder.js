var _ = require('lodash');
var alias = require('./alias.js');
var where = require('./where.js');

function group(options, aliases) {
  var query = '';
  if (typeof options == 'string'
      || options instanceof String)
    return alias.fieldName(options, aliases);
  _.each(options, function(group) {
    query += alias.fieldName(group, aliases) + ', ';
  });
  return query.split(/,\ $/)[0];
}

function order(options, aliases) {
  var query = '';
  _.each(options, function(order, field) {
    query += alias.fieldName(field, aliases) + ' ' + (order == 'desc' ? 'DESC' : 'ASC') + ', ';
  });
  return query.split(/,\ $/)[0];
}

function limit(options) {
  var query = '' + parseInt(options.limit);
  if (options.offset)
    query += ' OFFSET ' + parseInt(options.offset);
  return query;
}

module.exports = function(options, aliases) {
  var query = '';
  if (options.where && _.size(options.where) > 0)
    query += ' WHERE ' + where(options.where, aliases);
  if (options.group && _.size(options.group) > 0)
    query += ' GROUP BY ' + group(options.group, aliases);
  if (options.order && _.size(options.order) > 0)
    query += ' ORDER BY ' + order(options.order, aliases);
  if (options.limit)
    query += ' LIMIT ' + limit(options);
  return query;
}
