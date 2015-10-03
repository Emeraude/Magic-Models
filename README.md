# Magic Models

I decided to rewrite it from scratch. A functionnal version could be found on branch **release-0.7** and on **npm**.  
A simple, free software magical node.js ORM.  
For the moment, it only works with MariaDB.

## Connection

```javascript
var db = require('magic-models')({
	host: 'localhost', // default is 'localhost'
	user: 'root', // default is USER environment variable
	password: 'toor', // default is null
	database: 'foo' // defaut is none
});
db.on('ready', function() {
	// Do your work here
}).on('error', function(e) {
	throw e;
}).on('close', function(msg) {
	console.log('Client closed : ' + msg);
});
```

You can change the database later:

```javascript
db.use(dbName, function(e, r, i) {
	// the three arguments are described below
});
```

## Executing raw queries

```javascript
db.query(query, function(errors, rows, infos) {
	// errors is an array of strings, or undefined
	// rows is an array of rows, or undefined
	// infos is an object containing some informations:
	// insertId, affectedRows, numRows, query, queryTime, totalTime
});
```

### Escaping values

The method `db.escape` takes a Date object, a string, a boolean, a number or null as parameter and returns it escaped as a string.

```javascript
db.escape(42); // "42"
db.escape(true); // "true"
db.escape(null); // "NULL"
db.escape(new Date('Thu Aug 13 2015 01:17:44')); // "2015-08-13 01:17:44"
db.escape("foo\nbar"); // "foo\\nbar"
```

Note that `require('magic-models').escape` will work too.

## Defining models

Each model name must be in **CamelCase**. Each model will be usable in the `db` object.

```javascript
db.define('User', {
	id: {},
	login: {
		required: 'Login must not be empty' // this string will be sent if the login is not specified. A default message will be sent if set to true
	},
	mail: {
		default: null
	}
}, { // this third argument is optionnal
	erase: false, // if true and if the model is already defined, it will erase it. If false, it will be updated it
	tableName: 'Members', // change the default name of the table in the database. If not specified, the name of the table must be the name of the model pluralized
	createdAt: null, // this field will not be setted at the insertion
	modifiedAt: 'editionDate' // the field 'editionDate' will contain the current date at each update
});
```

By default the ORM will look for the *createdAt* and *modifiedAt* fields, it can be modified in the options, as seen above.  
Note that the name of the model is singular and the ORM will look for a table with the plural name.

### Default values

There are several ways to specify default values for each fields:

```javascript
default: "foo" // default value will be "foo" at the creation
default: ["foo", "bar"] // default value will be "foo" at the creation and "bar" at the update
default: {
	created: "foo", // default value will be "foo" at the creation and "bar" at the update
	modified: "bar" // you can specify only one of this two if you want
}
default: ["foo-bar"] // default value will be "foo-bar" at the creation and at the update
defaultCreated: "foo" // default value will be "foo" at the creation
defaultModified: "bar" // default value will be "bar" at the update
defaultBoth: "foo-bar" // default value will be "foo-bar" at the creation and at the update
```

### Author

**Emeraude**
