module.exports = function(orm, query, cb) {
  var date = new Date();
  orm.client.query(query)
    .on('result', function(r) {
      var datas = [];
      r.on('row', function(row) {
	datas.push(row);
      }).on('end', function(i) {
	i.query = query;
	i.queryTime = new Date() - date;
	cb(undefined, datas, i);
      }).on('error', function(e) {
	cb(e, undefined, {insertId: 0, affectedRows: 0, numRows: 0, query: query, queryTime: new Date() - date});
      });
    });
}
