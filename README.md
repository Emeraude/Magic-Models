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
```

### Defining Models

```javascript
db.define('Table', {
	'login': {
		
	}
})
```

### Author

**Emeraude**
