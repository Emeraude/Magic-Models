var queryBuilder = require('./queryBuilder');

module.exports = function(orm, model, where, cb) {
  orm.query(query + queryBuilder({where: where}), cb);
}
