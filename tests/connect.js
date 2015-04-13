exports.connect = function(test) {
    db = require('../lib')(require('../db.config.json'));
    db.on('loaded', function() {
	test.done();
    }).on('error', function(e) {
	test.ok(false, 'Unable to connect the database : ' + e);
	test.done();
    });
}
