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
    query += alias.fieldName(order, aliases) + ' ' + (order == 'desc' ? 'DESC' : 'ASC') + ',';
  });
  return query.split(/,\ $/)[0];
}

module.exports = function(options, aliases) {
  var query = '';
  if (options.where)
    query += ' WHERE ' + where(options.where, aliases)
  if (options.group)
    query += ' GROUP BY ' + group(options.group, aliases)
  if (options.order)
    query += ' ORDER BY ' + order(options.order, aliases)
  return query;
}
