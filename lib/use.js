module.exports = function(orm, database, cb) {
  var date = new Date();
  orm.query('USE ' + orm.escape.fieldName(database), function(e, r, i) {
    i.totalTime = new Date() - date;
    cb(e, r, i);
  });
}
