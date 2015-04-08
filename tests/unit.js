var _ = require('lodash');

exports.connect = function(test) {
    db = require('../lib')(require('../db.config.json'));
    db.on('loaded', function() {
	test.done();
    }).on('error', function(e) {
	test.ok(false, 'Unable to connect the database : ' + e);
	test.done();
    });
}

exports.query = {
    showTables: function(test) {
	db.query('SHOW TABLES', function(e, r, i) {
	    test.equal(e, undefined, e);
	    test.deepEqual({insertId: 0, affectedRows: 0, numRows: 3, query: 'SHOW TABLES'}, i, 'Informations object is incorrect');
	    test.ok(r[0], 'No table found in the database');
	    test.done();
	});
    },
    descTable: function(test) {
	db.query('DESC Users', function(e, r, i) {
	    test.equal(r.length, 6, 'Some fields are missing');
	    test.equal(e, undefined, e);
	    test.done();
	});
    },
    selectFromTable: function(test) {
	db.query('SELECT * FROM Users', function(e, r, i) {
	    test.equal(e, undefined, e);
	    test.equal(r.length, i.numRows);
	    test.done();
	});
    }
}

exports.defineModel = {
    defineOne: function(test) {
	db.define('User', {
	    id: {
		type: 'int',
		key: 'primary'
	    }
	});
	test.deepEqual(db.models.User.fields.id, {fieldName: 'id', type: 'int', key: 'primary', default: {created: null, modified: null}}, 'Model definition failed');
	test.done();
    },
    completeOne: function(test) {
	db.define('User', {
	    login: {
		type: 'varchar',
		length: 32,
		key: 'unique',
		validate: {
		    len: [4, 32],
		    is: /^[a-z0-9\-_\.]{4,32}$/i,
		    notIn: ['root', 'admin'],
		    isUnique: true
		},
		default: "anonymous"
	    }
	});
	test.deepEqual(db.models.User.fields, {id: {fieldName: 'id', type: 'int', key: 'primary', default: {created: null, modified: null}}, login: {fieldName: 'login', type: 'varchar', length: 32, key: 'unique', validate: {len: [4, 32], is: /^[a-z0-9\-_\.]{4,32}$/i, notIn: ['root', 'admin'], isUnique: true}, default: {created: 'anonymous', modified: null}}}, 'Model completion failed');
	test.done();
    },
    eraseOne: function(test) {
	db.define('User', {}, {erase: true});
	test.deepEqual(db.models.User.fields, {}, 'Model erase failed');
	test.done();
    },
    "defineMultiple (directory)": function(test) {
	db.modelsDir(require('path').join(__dirname, './models'));
	test.equal(_.size(db.models), 3, 'Wrong number of models defined');
	console.log(db.models);
	test.done();
    }
}
