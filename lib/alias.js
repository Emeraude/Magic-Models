var capitalize = require('capitalize');
var escape = require('./escape.js');

module.exports.fieldName = function(field, aliases) {
  if (field == '*')
    return '*';
  if (aliases && aliases[field])
    return escape.fieldName(aliases[field].fieldName);
  return escape.fieldName(field);
}

module.exports.as = function(field) {
  return escape.fieldName(field);
}

module.exports.aggregate = function(aggr, field) {
  if (field == '*')
    field = 'all';
  return aggr.toLowerCase() + capitalize(field);
}
