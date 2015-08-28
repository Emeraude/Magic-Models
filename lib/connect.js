module.exports = function(orm, config) {
  var Client = require('mariasql');

  client = new Client();
  client.connect({
    host: config.host || 'localhost',
    user: config.user || process.env.USER,
    password: config.password,
    db: config.database
  });
  client.on('connect', function(e) {
    orm.emit('connection', client);
  }).on('close', function(e) {
    orm.emit('close', e);
  }).on('error', function(e) {
    orm.emit('error', e);
  });
}
