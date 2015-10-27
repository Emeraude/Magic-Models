# Magic Models

A simple, free software magical node.js ORM.  
For the moment, it only works with MariaDB.

A lot of things have changed since **0.7**. You can see the (breaking) changes [here](https://gitlab.com/Emeraude/magic-models/wikis/From-0.7-to-1.0) and the legacy documentation [here](https://gitlab.com/Emeraude/magic-models/blob/release-0.7/README.md).

## Connection

```javascript
var MagicModels = require('magic-models);
var db = new MagicModels({
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

## Models methods

Once you have defined your model, the following methods will be available:  
Note that all of this methods are calling the db.query method. So, the callbacks of this methods are given to the db.query method and the arguments you will receive are the same.

```javascript
db.define('User', fields);
db.models.User.find({
	fields: ['login', 'password', {count: '*'}], // count: '*' will be aliased as 'countAll'
	where: {
		id: {
			'gt': 5
		}
	},
	order: {
		id: 'DESC'
	},
	group: 'login', // you can also give an array if you want to group several fields
	limit: 20,
	offset: 10 // it will work only if a limit is defined too
}, function(errors, rows, infos) {
	// getting all the rows matching, with only the fields you specified
	// if you no specify fields, you will get all of the fields defined in the model
	// note that the order, group, limit, offset and count clauses only work for the method .find, .count and .all
});
db.models.User.describe(function(errors, rows, infos) {
	// getting the description of the table in the database
	// rows will be an object with the field name as key
});
db.models.User.create({
	login: 'root',
	password: 'toor'
}, function(errors, rows, infos) {
	// check for the validity of the values, but not the default values set in the model definition
	// create an user in the database with the login 'root' and the password 'toor'
	// rows will be an object containing all the inserted values
});
db.models.User.update({
	values: {
		login: 'admin'
	},
	where: {
		id: 1
	}
}, function(errors, rows, infos) {
	// check for the validity of the values
	// change the login of the users who have the id '1'
	// rows will be an empty array
});
db.models.User.delete({
	id: 2
}, function(errors, rows, infos) {
	// remove the user who have the id '2'
	// rows will be an empty array
}
```

If you give the callback as the first argument of this functions, it will works well, and the object usually used as first argument will be `{}`.

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

## Hooks

You can add functions that will be called before and after each query method.  
The following hooks are supported:

```javascript
beforeFind(datas, callback);
afterFind(errors, rows, infos, callback);
beforeValidate(datas, callback);
afterValidate(datas, callback);
beforeCreate(datas, callback);
afterCreate(errors, rows, infos, callback);
beforeUpdate(datas, callback);
afterUpdate(errors, rows, infos, callback);
beforeDelete(datas, callback);
afterDelete(errors, rows, infos, callback);
```

### Order of operations
#### Create

```javascript
// beforeValidate
validate
// afterValidate
// beforeCreate
create
// afterCreate
```

#### Update

```javascript
// beforeValidate
validate
// afterValidate
// beforeUpdate
update
// afterUpdate
```

#### Delete

```javascript
// beforeDelete
delete
// afterDelete
```

#### Find

```javascript
// beforeFind
find
// afterFind
```

### Declaring hooks

Hooks have to be declared in the third parameter of `db.define`.

```javascript
db.define('User', fields, {
	beforeValidate: function(datas, callback) {
		callback(datas);
	},
	afterCreate: function(errors, rows, infos, callback) {
		callback(errors, rows, infos);
	}
});
```

Note that if you don't call the callback, the query will be interrupted.

### Author

**Emeraude**
