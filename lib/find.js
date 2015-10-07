var _ = require('lodash');
var alias = require('./alias.js');
var escape = require('./escape.js');
var queryBuilder = require('./queryBuilder.js');

module.exports = function(orm, model, options, cb) {
  if (cb === undefined) {
    cb = options;
    options = {}
  }
  var query = 'SELECT';
  if (!options.fields)
    options.fields = _.keys(model.fields);
  _.each(options.fields, function(name) {
    if (typeof name == 'string'
	|| name instanceof String) {
      if (model.fields[name])
	query += ' ' + alias.fieldName(name, model.fields) + ' AS ' + alias.as(name) + ',';
    }
    else {
      _.each(name, function(n, p) {
	if (model.fields[n])
	  query += ' ' + p.toUpperCase() + '(' + alias.fieldName(n, model.fields) + '),';
      });
    }
  });
  query = query.split(/,$/)[0];
  query += ' FROM ' + escape.fieldName(model.table) + queryBuilder(options);
  orm.query(query, cb);
}
