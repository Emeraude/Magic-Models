var escape = require('./escape.js');

module.exports.fieldName = function(field, aliases) {
  if (aliases && aliases[field])
    return escape.fieldName(aliases[field].fieldName);
  return escape.fieldName(field);
}
