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

## Defining models

Each model name must be in **CamelCase**. Each model will be usable in the `db` object.

```javascript
db.define('User', {
	id: {},
	login: {},
	mail: {}
}, { // this third argument is optionnal
	erase: false, // if true and if the model is already defined, it will erase it. If false, it will be updated it
	tableName: 'Members', // change the default name of the table in the database. If not specified, the name of the table must be the name of the model pluralized
	createdAt: null, // this field will not be setted at the insertion
	modifiedAt: 'editionDate' // the field 'editionDate' will contain
});
```

By default the orm will look for the *createdAt* and *modifiedAt* fields, it can be modified in the options, as seen above.  
Note that the name of the model is singular and the ORM will look for a table with the plural name.

### Author

**Emeraude**
