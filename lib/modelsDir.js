var fs = require('fs');
var path = require('path');

module.exports = function(dirs, db) {
    if (typeof dirs == 'string')
	dirs = [dirs];
    for (i in dirs) {
	fs.readdirSync(dirs[i]).filter(function(file) {
	    return file.indexOf('.') !== 0;
	}).forEach(function(file) {
	    require(path.join(dirs[i], file))(db);
	});
    }
}
