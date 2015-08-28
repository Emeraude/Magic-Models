var EventEmitter = require('events').EventEmitter;

module.exports = function(config) {
  var orm = new EventEmitter();

  require('./connect')(orm, config);
  orm.on('connection', function(client) {
    orm.client = client;
    orm.query = function(query, cb) {
      require('./query')(orm, query, cb);
    }
    orm.define = function(name, fields, options) {
      require('./define')(orm, name, fields, options);
    };
  });
  return orm;
}
