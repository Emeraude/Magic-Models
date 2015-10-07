var _ = require('lodash');
var alias = require('./aliases.js');
var where = require('./where.js');

function group(options, aliases) {
  var query = '';
  if (typeof options == 'string'
      || options instanceof String)
    return alias.fieldName(options.group);
  _.each(options.group, function(group) {
    query += alias.fieldName(options.group) + ', ';
  });
  return query.split(/,\ $/)[0];
}

module.exports = function(options, aliases) {
  var query = '';
  if (options.where)
    query += ' WHERE ' + where(options.where, aliases)
  if (options.group)
    query += ' GROUP BY ' + group(options.group, aliases)
  return query;
}
