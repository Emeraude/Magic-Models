var _ = require('lodash');
var escape = require('./escape.js');
var alias = require('./alias.js');

module.exports = function(orm, model, data, cb) {
  var query = 'INSERT INTO ' + escape.fieldName(model.table) + '(';
  var fields = '';
  var values = '';

  _.each(data, function(v, f) {
    if (fields != '') {
      fields += ',';
      values += ',';
    }
    fields += alias.fieldName(f, model);
    query += escape(v);
  });

  query += fields + ') VALUES(' + values + ')';
  orm.query(query, cb);
}
