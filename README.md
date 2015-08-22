# Magic Models

I decied to rewrite it from scratch. A functionnal version could be found on branch **release-0.7** and on **npm**.  
A simple, free software magical node.js ORM.  
For the moment, it only works with MariaDB.

## Connection

```javascript
var db = require('magic-models')({
	host: 'localhost',
	user: 'root',
	password: 'toor',
	db: 'foo'
});
db.on('error', function(e) {
	throw e;
}).on('close', function(msg) {
	console.log('Client closed : ' + msg);
});
```

### Author

**Emeraude**
