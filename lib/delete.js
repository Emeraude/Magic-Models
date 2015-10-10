var alias = require('./alias');
var queryBuilder = require('./queryBuilder');

module.exports = function(orm, model, where, cb) {
  if (cb === undefined) {
    cb = where;
    where = {};
  }
  query = 'DELETE FROM ' + alias.fieldName(model.table) + queryBuilder({where: where});
  orm.query(query, cb);
}
