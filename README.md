# Magic Models

A simple, free software magical node.js ORM.  
For the moment, it only works with MariaDB.

A lot of things have changed since **0.7**. You can see the (breaking) changes [here](https://gitlab.com/Emeraude/magic-models/wikis/From-0.7-to-1.0) and the legacy documentation [here](https://gitlab.com/Emeraude/magic-models/blob/release-0.7/README.md).

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
db.escape(42); // '42'
db.escape(true); // 'true'
db.escape(null); // 'NULL'
db.escape(new Date('Thu Aug 13 2015 01:17:44')); // '2015-08-13 01:17:44'
db.escape("foo\nbar"); // '"foo\\nbar"'
db.escape(/[\w.]*@\w*.\w{2,}/i); // '"[\\\\w.]*@\\\\w*.\\\\w{2,}"'
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
		default: null,
		fieldName: 'email'
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
It is also possible to specify the directory where the models are located with the following:

```javascript
db.load('models')
```

A list of directories is also possible:

```javascript
db.load(['./models',
		 './moreModels'])
```

Note that the directories are relative to the file where `db.load` is called.  
In both of this two cases, you need to define your models in this way:

```javascript
module.exports = function(db) {
	db.define('User', {
		id: {},
		login: {
			required: 'Login is mandatory'
		}
	});
}
```

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

### Where

You can combine a lot of options in the where clause:

```javascript
where: {
	id: 5, // WHERE `id` = 5
	id: [1, 5], // WHERE `id` IN(1, 5)
	id: {
		bewteen: [1, 5], // WHERE `id` BETWEEN 1 AND 5
		gt: 5, // WHERE `id` > 5
		gte: 5, // WHERE `id` >= 5
		lt: 5, // WHERE `id` < 5
		lte: 5, // WHERE `id` <= 5
		ne: 5, // WHERE `id` != 5
		eq: 5, // WHERE `id` = 5
		not: 5 // WHERE `id` NOT 5
	},
	login: {
		like: "%admin%", // WHERE `login` LIKE "%admin%"
		match: /[a-z]*/i // WHERE `login` REGEXP "[a-z]*"
	}
	or: [ // WHERE ((`id` = 5) OR (`login` = "admin"))
		{id: 5},
		{login: "admin"}
	]
}
```

You can combine all of this, including **AND** and **OR**, priorities will be respected.

```javascript
where: {
	or: [
		{type: 'dog', color: 'white', size: 'large'},
		{type: 'cat', or: [
							{size: 'small'},
							{color: 'black'}
						]
		}
	]
}
```

It'll generate the following request:

```sql
WHERE ((`type` = "dog" AND `color` = "white" AND `size` = "large") OR (`type` = "cat" AND ((`size` = "small") OR (`color` = "black"))))'
```


### Author

**Emeraude**
