var _ = require('lodash');
var alias = require('./alias');

module.exports = function(orm, model, cb) {
  orm.query('DESCRIBE ' + alias.fieldName(model.table), function(e, r, i) {
    var rows = {};
    _.each(r, function(l) {
      rows[l.Field] = l;
      delete rows[l.Field].Field;
    });
    cb(e, rows, i);
  });
}
