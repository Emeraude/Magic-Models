var fs = require('fs');
var path = require('path');

module.exports = function(dir, db) {
    fs.readdirSync(dir).filter(function(file) {
	return file.indexOf('.') !== 0;
    }).forEach(function(file) {
	require(path.join(dir, file))(db);
    });
}
