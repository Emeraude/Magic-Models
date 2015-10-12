var alias = require('./alias');
var queryBuilder = require('./queryBuilder');

function _delete(orm, model, where, cb) {
  query = 'DELETE FROM ' + alias.fieldName(model.table) + queryBuilder({where: where});
  orm.query(query, cb);
}

module.exports = function(orm, model, where, cb) {
  if (cb === undefined) {
    cb = where;
    where = {};
  }

  model.hooks.beforeDelete(where, function(where) {
    _delete(orm, model, where, function(e, r, i) {
      model.hooks.afterDelete(e, r, i, cb);
    });
  });
}
