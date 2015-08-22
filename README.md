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

## Executing raw queries

```javascript
db.query(query, function(errors, rows, infos) {
	// errors is an array of strings, or undefined
	// rows is an array of rows, or undefined
	// infos is an object containing some informations:
	// insertId, affectedRows, numRows, query, queryTime
});
```

### Author

**Emeraude**
