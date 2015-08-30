module.exports = function(orm, database, cb) {
  var date = new Date();
  orm.query('USE ' + orm.escape.fieldName(database), function(e, r, i) {
    i.totalTime = new Date() - date;
    console.log(arguments);
    cb(e, r, i);
  });
}
