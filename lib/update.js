var _ = require('lodash');
var escape = require('./escape.js');
var alias = require('./alias.js');

module.exports = function(orm, model, options, cb) {
  if (cb === undefined) {
    cb = data;
    data = {};
  }

  var query = 'UPDATE ' + escape.fieldName(model.table) + ' SET ';
  _.each(model.fields, function(f, n) {
    if (f.default.modified && options.fields[n] === undefined)
      options.fields[n] = f.default.modified;
  });

  _.each(options.fields, function(v, f) {
    query += alias.fieldName(f, model) + ' = ' + escape(v) + ', ';
  });

  if (model.modifiedAt)
    query += alias.fieldName(model.modifiedAt) + ' = NOW()';

  query = query.split(/,\ /)[0];
  query += queryBuilf(options);
  orm.query(query, cb);
}
