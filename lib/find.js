var _ = require('lodash');
var alias = require('./alias.js');
var escape = require('./escape.js');

module.exports = function(orm, model, options, cb) {
  if (cb === undefined) {
    cb = options;
    options = {}
  }
  var query = 'SELECT';
  if (!options.fields)
    options.fields = _.keys(model.fields);
  _.each(options.fields, function(name) {
    if (model.fields[name])
      query += ' ' + alias.fieldName(name, model.fields) + ' AS ' + alias.as(name) + ',';
  });
  query = query.split(/,$/)[0];
  query += ' FROM ' + escape.fieldName(model.table);
  orm.query(query, cb);
}
