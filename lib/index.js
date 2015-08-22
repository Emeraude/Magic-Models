var EventEmitter = require('events').EventEmitter;

module.exports = function(config) {
  var orm = new EventEmitter();

  orm.client = require('./connect')(orm, config);
  orm.on('connection', function() {
    // orm.query = require('./query');
  });
}
