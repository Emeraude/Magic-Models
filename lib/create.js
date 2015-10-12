var _ = require('lodash');
var escape = require('./escape.js');
var alias = require('./alias.js');

function create(orm, model, data, cb) {
  var query = 'INSERT INTO ' + escape.fieldName(model.table) + '(';
  var fields = '';
  var values = '';

  _.each(model.fields, function(f, n) {
    if (f.default.created && data[n] === undefined)
      data[n] = f.default.created;
  });

  _.each(data, function(v, f) {
    if (fields != '') {
      fields += ', ';
      values += ', ';
    }
    fields += alias.fieldName(f, model);
    values += escape(v);
  });

  function time(when) {
    if (model[when + 'At']) {
      if (fields != '') {
	fields += ', ';
	values += ', ';
      }
      fields += alias.fieldName(model[when + 'At']);
      values += 'NOW()';
    }
  }
  time('created');
  time('modified');

  query += fields + ') VALUES(' + values + ')';
  orm.query(query, function(e, r, i) {
    if (r !== undefined)
      r = data;
    cb(e, r, i);
  });
}

module.exports = function(orm, model, data, cb) {
  if (cb === undefined) {
    cb = data;
    data = {};
  }

  model.hooks.beforeValidate(data, function(data) {
    model.hooks.afterValidate(data, function(data) {
      model.hooks.beforeCreate(data, function(data) {
	create(orm, model, data, function(e, r, i) {
	  model.hooks.afterCreate(e, r, i, cb);
	});
      });
    });
  });
}
