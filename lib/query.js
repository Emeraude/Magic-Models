module.exports = function(orm, query, cb) {
  var date = new Date();
  orm.client.query(query, function(e, r) {
    var i = r ? r.info : undefined;
    if (e !== null)
      i = {insertId: 0, affectedRows: 0, numRows: 0, query: query, totalTime: new Date() - date, queryTime: new Date() - date};
    else {
      i.query = query;
      i.queryTime = i.totalTime = new Date() - date;
      delete i.metadata;
      i.insertId = parseInt(i.insertId);
      i.affectedRows = parseInt(i.affectedRows);
      i.numRows = parseInt(i.numRows);
    }
    cb(e, r, i);
  });
}
