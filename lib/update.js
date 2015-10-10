var _ = require('lodash');
var escape = require('./escape.js');
var alias = require('./alias.js');
var queryBuilder = require('./queryBuilder.js');

module.exports = function(orm, model, data, cb) {
  if (cb === undefined) {
    cb = data;
    data = {values: {}};
  }

  var query = 'UPDATE ' + escape.fieldName(model.table) + ' SET ';
  _.each(model.fields, function(f, n) {
    if (f.default.modified && data.values[n] === undefined)
      data.values[n] = f.default.modified;
  });

  _.each(data.values, function(v, f) {
    query += alias.fieldName(f, model) + ' = ' + escape(v) + ', ';
  });

  if (model.modifiedAt)
    query += alias.fieldName(model.modifiedAt) + ' = NOW()';

  query = query.split(/,\ $/)[0];
  query += queryBuilder(data);
  orm.query(query, cb);
}
