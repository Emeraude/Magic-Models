var fs = require('fs');
var path = require('path');
var stack = require('stack-infos');

module.exports = function(orm, dirs) {
  if (typeof dirs == 'string')
    dirs = [dirs];
  for (i in dirs) {
    fs.readdirSync(path.join(stack(2).dir, dirs[i])).filter(function(file) {
      return file[0] !== '.';
    }).forEach(function(file) {
      require(path.join(path.relative(__dirname, stack(4).dir), dirs[i], file))(orm);
    });
  }
}
