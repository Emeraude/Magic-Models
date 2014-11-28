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

### Executing raw queries

You can make raw queries easily, with the following:

```javascript
db.query(query, function(errors, rows, infos) {
	// errors is an array of strings, or null
	// rows is an array of rows, or undefined if an error occured
	// infos is an array of informations, as the affected rows and the query executed, or undefined if an error occured
});
```

You can also do the same asynchronously:

```javascript
var queryResult = db.queryAsync(query);
// queryResult will be an object containing the errors, the rows and the infos
```

## Defining Models

```javascript
db.define('User', {
	login: {
		type: 'varchar',
		length: 32,
		validate: {
			isUnique: true
		},
		mail: {
			type: 'varchar',
			length: 255,
			default: 'NULL'
		}
	}
})
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
		login: {
			type: 'varchar',
			length: 32,
			validate: {
				isUnique: true
			}
		},
		mail: {
			type: 'varchar',
			length: 255,
			default: 'NULL'
		}
	});
}
```

The models you define are in `db.models`

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
	custom: function(args) {
		// the validation fail if return null
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
		first: function(args) {
			;
		},
		second: function(args) {
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
required: true
isIn: ["foo", "bar"]
notIn: ["toto", "titi"]
isUnique: true
len: [4, 32]
minLen: 4
maxLen: 32
between: [5, 10]
min: 5
max: 10
isUrl: "https://npmjs.org"
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
	}
}, function(errors, rows, infos) {
	// getting all the rows matching, with only the fields you specified
	// if you no specify fields, you will get all of the fields defined in the model
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
	// rows will be empty
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
	// rows will be empty
});
db.models.User.delete({
	id: 2
}, function(errors, rows, infos) {
	// remove the user who have the id '2'
	// rows will be empty
}
```

### Where

```
 _____ _____ ____  _____
|_   _|     |    \|     |
  | | |  |  |  |  |  |  |
  |_| |_____|____/|_____|
```

## Contributing

If you think a feature is missing, you can open an issue, or try to make it and then do a pull request.  
If you find a bug, open an issue too. You can also fix it and do a pull request.

### Author

**Emeraude**
