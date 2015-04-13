exports.connect = function(test) {
    db = require('../lib')({
	"host": "localhost",
	"db": "magic_models_example",
	"user": "root",
	"password": "toor"
    });
    db.on('loaded', function() {
	test.done();
    }).on('error', function(e) {
	test.ok(false, 'Unable to connect the database : ' + e);
	test.done();
    });
}
