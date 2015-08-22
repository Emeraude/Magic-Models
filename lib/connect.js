module.exports = function(orm, config) {
  var Client = require('mariasql');

  client = new Client();
  client.connect({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.db
  });
  client.on('connect', function(e) {
    orm.emit('connection');
  }).on('close', function(e) {
    orm.emit('close', e);
  }).on('error', function(e) {
    orm.emit('error', e);
  });
}
