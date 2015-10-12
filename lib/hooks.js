var beforeQuery = ['beforeValidate', 'afterValidate', 'beforeCreate', 'beforeUpdate', 'beforeDelete', 'beforeFind'];
var afterQuery = ['afterCreate', 'afterUpdate', 'afterDelete', 'afterFind'];

for (i in beforeQuery) {
  module.exports[beforeQuery[i]] = function(d, callback) {
    callback(d);
  }
}

for (i in afterQuery) {
  module.exports[afterQuery[i]] = function(e, r, i, callback) {
    callback(e, r, i);
  }
}
