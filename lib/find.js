var _ = require('lodash');
var alias = require('./alias.js');
var escape = require('./escape.js');
var queryBuilder = require('./queryBuilder.js');

function find(orm, model, options, cb) {
  var query = 'SELECT';
  if (!options.fields)
    options.fields = _.keys(model.fields);
  _.each(options.fields, function(name) {
    if (typeof name == 'string'
	|| name instanceof String) {
      query += ' ' + alias.fieldName(name, model.fields) + ' AS ' + alias.as(name) + ',';
    }
    else {
      _.each(name, function(n, p) {
	query += ' ' + p.toUpperCase() + '(' + alias.fieldName(n, model.fields) + '),';
      });
    }
  });
  query = query.split(/,$/)[0];
  query += ' FROM ' + escape.fieldName(model.table) + queryBuilder(options);
  orm.query(query, cb);
}

module.exports = function(orm, model, options, cb) {
  if (cb === undefined) {
    cb = options;
    options = {}
  }

  model.hooks.beforeFind(options, function(options) {
    find(orm, model, options, function(e, r, i) {
      model.hooks.afterFind(e, r, i, cb);
    });
  });
}
