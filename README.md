# Magic Models

A simple, free software magical node.js ORM.

## Installation

	npm install --python=python2

## Usage
### Connexion

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
	// rows is an array of rows, or undefined
	// infos is an array of informations, as the affected rows for example, or undefined
});
```

You can also do the same asynchronously:

```javascript
var queryResult = db.queryAsync(query);
// queryResult will be an object containing the errors, the rows and the infos
```

### Defining Models

```javascript
db.define('Table', {
	login: {
		type: 'varchar',
		length: 32,
		validate: {
			isUnique: true
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

### Author

**Emeraude**
