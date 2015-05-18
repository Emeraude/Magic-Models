# Magic Models

A simple, free software magical node.js ORM.  
For the moment, it only works with MariaDB.

## Installation

```bash
npm install --python=python2
```

## Usage
### Connection

```javascript
var db = require('magic-models')({
	host: '127.0.0.1',
	user: 'root',
	password: 'toor',
	db: 'foo'
});
db.on('loaded', function() {
	// event emitted when all the connexion to the database is etablished
}).on('error', function(e) {
	// event emitted when an error occur while trying to connect the database
});
```

Once you are done, you can simply quit magic-models with the following:

```javascript
db.exit(); // note that if you don't do it, the program may not exit
```

### Executing raw queries

You can make raw queries easily, with the following:

```javascript
db.query(query, function(errors, rows, infos) {
	// errors is an array of strings, or null
	// rows is an array of rows, or undefined if an error occured
	// infos is an array containing the following informations:
	// insertId, affectedRows, numRows, query
});
```

You can also do the same asynchronously:

```javascript
var queryResult = db.queryAsync(query);
// queryResult will be an object containing the errors, the rows and the infos
```

Note that this one is **deprecated** since *0.7.0* and will be removed in *1.0.0*

## Defining Models

```javascript
db.define('User', {
	id: {
		type: 'int',
		key: 'primary' // the primary key field is saved in db.models.User.primaryKey ; if no primary key is specified, this value will be null.
	},
	login: {
		type: 'varchar',
		length: 32,
		key: 'unique',
		validate: {
			isUnique: true
		},
		required: 'Login is mandatory'
	},
	mail: {
		type: 'varchar',
		length: 255,
		default: 'NULL'
	}
})
```

Note that the name of the model is singular and the ORM will look for a table with the plural name.  
To avoid this behaviour, you can specify a custom table name with the third argument of `db.define`:

```javascript
db.define('User', fields, {
	tableName: 'Members'
});
```

It is also possible to specify the models directory with the following:

```javascript
db.modelsDir(require('path').join(__dirname, './models'))
```

A list of directories is also possible:

```javascript
db.modelsDir([require('path').join(__dirname, './models'),
			  require('path').join(__dirname, './moreModels')])
```

In both of this two cases, you need to define your models in this way:

```javascript
module.exports = function(db) {
	db.define('User', {
		id: {
			type: 'int',
			key: 'primary'
		},
		login: {
			type: 'varchar',
			length: 32,
			key: 'unique',
			validate: {
				isUnique: true
			},
			required: 'Login is mandatory'
		},
		mail: {
			type: 'varchar',
			length: 255,
			default: 'NULL'
		}
	});
}
```

You can define multiple times the same model, it will be updated :

```javascript
db.define('User', {
	id: {
		type: 'int',
		key: 'primary'
	}
});
db.define('User', { // The model 'User' will contain the two fields 'id' and 'login'
	login: {
		type: 'varchar',
		length: 32,
		key: 'unique',
		validate: {
			isUnique: true
		}
	}
});
```

You can avoid this behaviour by giving the `erase` option to the third argument of `db.define` :

```javascript
db.define('User', { // The model 'User' will only contain the field 'login'
	login: {
		type: 'varchar',
		length: 32,
		key: 'unique',
		validate: {
			isUnique: true
		}
	}, {
		erase: true
	}
});
```

The models you define are in `db.models`

### Default values

There is several ways to set default values:

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

By default, the orm will look for a `createdAt` and a `modifiedAt` field.  
If they don't exist, the `.create()` and the `.update()` methods will not work.  
You can change the fields looking for or avoid this behaviour with the third argument of `db.define`:

```javascript
db.define('User', fields, {
	createdAt: 'date' // the field containing the creation date will be 'date'
	modifiedAt: false // the orm will not try to update this field when doing an update
});
```

### Models validation rules

There is several ways to define validations rules:

```javascript
// type 1: custom error message with builtin rule
validate: {
	is: {
		val: regExp,
		msg: customMessage
	}
}
// type 2: default error message with builtin rule
validate: {
	is: regExp
}
// type 3: default error message with custom rule
validate: {
	custom: function(args, cb) {
		cb(true);
		// the validation fail if you call cb with false
		// never call the callback more than once, or there will be an undefined behaviour
	},
}
// type 4: custom error message with several builtin rules
validate: {
	custom: {
		is: regExp,
		not: regExp,
		msg: customMessage
	}
}
// type 5: custom error message with one or several custom rules
validate: {
	custom: {
		first: function(args, cb) {
			;
		},
		second: function(args, cb) {
			;
		},
		msg: customMessage
	}
}
```

Note that you can mix types 4 and 5 validations rules.  
For the moments, the following rules are builtin:

```javascript
is: /^[a-z]*$/i // also accepts a string
not: /^[0-9]*$/ // also accepts a string
required: true // deprecated since 0.7.0 ; it will be removed in 1.0.0
isIn: ["foo", "bar"]
notIn: ["toto", "titi"]
isUnique: true
len: [4, 32]
minLen: 4
maxLen: 32
between: [5, 10]
min: 5
max: 10
isAfter: "1474-11-13" // also accepts a date object
isBefore: "1605-11-05" // also accepts a date object
isBetween: [new Date(1474, 10, 13), new Date(1605, 10, 5))] // also accepts strings
isUrl: "https://npmjs.org"
isIP: "127.0.0.1" // matchs IPv4 and IPv6
isIPv4: "127.0.0.1"
isIPv6: "2001:db8:0:85a3::ac1f:8001"
```

In your custom validations rules, args will be this object:

```javascript
{
	data: data, // an object containing all the values setted
	model: model, // the model
	checkField: {
		name: 'login', // the name of the field you have to check
		val: 'admin' // the value of the field you have to check
	},
	rule: {
		name: 'custom', // the name of the rule
		val: [Function] // the value of the rule; for a custom rule, it is the validation function
		},
	msg: message // the message that will be send if validation rule fail
}
```

## Models methods

Once you have defined your model, the following methods will be available:  
Note that all of this methods are calling the db.query method. So, the callbacks of this methods are given to the db.query method and the arguments you will receive are the same.

```javascript
db.define('User', fields);
db.models.User.all({
	fields: ['login', 'password'],
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
	offset: 10, // it will work only if a limit is defined too
	count: true // will only return the number of rows
}, function(errors, rows, infos) {
	// getting all the rows matching, with only the fields you specified
	// if you no specify fields, you will get all of the fields defined in the model
	// note that the order, group, limit, offset and count clauses only work for the method .find, .count and .all
});
db.models.User.find(options, function(errors, rows, infos) {
	// this method is the same as .all, but you will get only one row.
	// rows will be an object containing the row
	// it you don't want to have this rows format, you can call .all with a limit: 1 option
});
db.models.User.count(options, function(errors, rows, infos) {
	// this method is the same as .all, but rows will coutain the number of rows matching
	// rows will be an integer or an array of integers
	// it you don't want to have this rows format, you can call .all with a count: true option
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

All of this functions have an equivalent who works asynchronously:

```javascript
db.models.User.allAsync(options);
db.models.User.findAsync(options);
db.models.User.countAsync(options);
db.models.User.describeAsync();
db.models.User.createAsync(options);
db.models.User.updateAsync(options);
db.models.User.deleteAsync(options);
```

Note that all of this functions are **deprecated** since *0.7.0* and will be removed in *1.0.0*

### Where

You can combine a lot of options in the where clause:

```javascript
where: {
	id: 5, // WHERE `id` = "5"
	id: [1, 5], // WHERE `id` IN("1", "5")
	id: {
		bewteen: [1, 5], // WHERE `id` BETWEEN "1" AND "5"
		gt: 5, // WHERE `id` > "5"
		gte: 5, // WHERE `id` >= "5"
		lt: 5, // WHERE `id` < "5"
		lte: 5, // WHERE `id` <= "5"
		ne: 5, // WHERE `id` != "5"
		eq: 5, // WHERE `id` = "5"
		not: 5 // WHERE `id` NOT "5"
	},
	login: {
		like: "%admin%", // WHERE `login` LIKE "%admin%"
		match: /[a-z]*/i // WHERE `login` REGEXP "[a-z]*"
	}
	or: [ // WHERE ((`id` = "5") OR (`login` = "admin"))
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

You can add functions that will be called before and after each method.  
The following hooks are supported :

```javascript
beforeFind(datas, callback);
afterFind(errors, rows, infos, callback);
beforeValidate(datas, callback);
afterValidate(datas, callback);
beforeCreate(datas, callback);
afterCreate(errors, rows, infos, callback);
beforeSave(datas, callback);
afterSave(errors, rows, infos, callback);
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
// beforeSave
create
// afterSave
// afterCreate
```

#### Update

```javascript
// beforeValidate
validate
// afterValidate
// beforeUpdate
// beforeSave
update
// afterSave
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

Note that if you don't call the callback, it will results to an undefined behaviour.  
In the case of an **update**, the param `datas` will only contain the new values, not the where informations.

## Contributing

If you think a feature is missing, you can open an issue, or try to make it and then do a pull request.  
If you find a bug, open an issue too. You can also fix it and do a pull request.  
If you think this doc is incomplete, you can improve it the same way.

### Author

**Emeraude**
