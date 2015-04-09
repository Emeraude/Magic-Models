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
    },

    cleaningTables: function(test) {
	db.query('TRUNCATE TABLE Users', function(e, r, i) {
	    test.equal(e, undefined, e);
	    db.query('TRUNCATE TABLE News', function(e, r, i) {
		test.equal(e, undefined, e);
		db.query('TRUNCATE TABLE Messages', function(e, r, i) {
		    test.equal(e, undefined, e);
		    test.done();
		});
	    });
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
    modelsDir: {
	generate: function(test) {
	    db.modelsDir(require('path').join(__dirname, './models'));
	    test.equal(_.size(db.models), 3, 'Wrong number of models defined');
	    test.done();
	},

	user: function(test) {
	    test.deepEqual(db.models.User.fields, {id: {fieldName: 'id', type: 'int', key: 'primary', default: {created: null, modified: null}}, login: {fieldName: 'login', type: 'varchar', length: 32, key: 'unique', validate: {len: [4, 32], is: /^[a-z0-9\-_\.]{4,32}$/i, notIn: ['root', 'admin'], required: true, isUnique: true}, default: { created: 'anonymous', modified: null}}, password: {fieldName: 'password', type: 'varchar', length: 255, validate: {validPassword: {minLen: 8, required: true, msg: 'Password not strong enough'}}, default: {created: null, modified: null}}, mail: {fieldName: 'mail', type: 'varchar', length: 255, validate: {maxLen: 255}, default: {created: null, modified: null}}}, 'Model `User` not defined correctly');
	    test.equal(db.models.User.table, 'Users', 'Wrong table name for model `User`');
	    test.equal(db.models.User.primaryKey, 'id', 'Wrong primary key for model `User`');
	    test.equal(db.models.User.createdAt, 'createdAt', 'Wrong createdAt field for model `User`');
	    test.equal(db.models.User.modifiedAt, 'modifiedAt', 'Wrong modifiedAt field for model `User`');
	    test.done();
	},

	news: function(test) {
	    test.deepEqual(db.models.News.fields, {id: { fieldName: 'id', type: 'int', key: 'primary', default: {created: null, modified: null}}, userId: {fieldName: 'userId', type: 'int', default: {created: null, modified: null}}, title: {fieldName: 'title', type: 'varchar', length: 255, default: {created: null, modified: null}}, content: {fieldName: 'content', type: 'text', validate: {minLen: {val: 50, msg: 'Content too short'}}, default: {created: null, modified: null}}}, 'Model `News` not defined correctly');
	    test.equal(db.models.News.table, 'News', 'Wrong table name for model `News`');
	    test.equal(db.models.News.primaryKey, 'id', 'Wrong primary key for model `News`');
	    test.equal(db.models.News.createdAt, 'createdAt', 'Wrong createdAt field for model `News`');
	    test.equal(db.models.News.modifiedAt, 'modifiedAt', 'Wrong modifiedAt field for model `News`');
	    test.done();
	},

	message: function(test) {
	    test.deepEqual(db.models.Message.fields, {id: {fieldName: 'id', type: 'int', key: 'primary', default: {created: null, modified: null}}, userId: {fieldName: 'userId', type: 'int', default: {created: null, modified: null}}, title: {fieldName: 'title', type: 'varchar', length: 255, validate: {len: [8, 255]}, default: {created: null, modified: null}}, content: {fieldName: 'content', type: 'text', validate: {minLen: 50}, default: {created: null, modified: null}}}, 'Model `Message` not defined correctly');
	    test.equal(db.models.Message.table, 'Messages', 'Wrong table name for model `Message`');
	    test.equal(db.models.Message.primaryKey, 'id', 'Wrong primary key for model `Message`');
	    test.equal(db.models.Message.createdAt, 'createdAt', 'Wrong createdAt field for model `Message`');
	    test.equal(db.models.Message.modifiedAt, null, 'Wrong modifiedAt field for model `Message`');
	    test.done();
	}
    }
}

// TODO : validation rules

exports.modelFunctions = {
    create: {
	badTests: {
	    EmptyObject: function(test) {
		db.models.User.create({}, function(e, r, i) {
		    test.equal(i, undefined, 'This test should fail');
		    test.deepEqual(e, {validationErrors: ['Rule "required" for field `login` has not been successfully validated.', 'Password not strong enough']}, 'This test should fail');
		    test.done();
		});
	    },

	    invalidValidations: {
		is: function(test) {
		    db.models.User.create({login: ''}, function(e, r, i) {
			test.equal(i, undefined, 'This test should fail');
			test.deepEqual(e, {validationErrors: ['Rule "len" for field `login` has not been successfully validated.', 'Rule "is" for field `login` has not been successfully validated.', 'Password not strong enough']}, 'This test should fail');
			test.done();
		    });
		},

		len: function(test) {
		    db.models.User.create({login: 'foobarfoobarfoobarfoobarfoobarfoobar'}, function(e, r, i) {
			test.equal(i, undefined, 'This test should fail');
			test.deepEqual(e, {validationErrors: ['Rule "len" for field `login` has not been successfully validated.', 'Rule "is" for field `login` has not been successfully validated.', 'Password not strong enough']}, 'This test should fail');
			test.done();
		    });
		},

		notIn: function(test) {
		    db.models.User.create({login: 'root'}, function(e, r, i) {
			test.equal(i, undefined, 'This test should fail');
			test.deepEqual(e, {validationErrors: ['Rule "notIn" for field `login` has not been successfully validated.', 'Password not strong enough']}, 'This test should fail');
			test.done();
		    });
		},

		required: function(test) {
		    db.models.User.create({login: undefined},  function(e, r, i) {
			test.equal(i, undefined, 'This test should fail');
			test.deepEqual(e, {validationErrors: ['Rule "required" for field `login` has not been successfully validated.', 'Password not strong enough']}, 'This test should fail');
			test.done();
		    });
		},

		minLen: function(test) {
		    db.models.User.create({login: undefined, password: 'foobar2'},  function(e, r, i) {
			test.equal(i, undefined, 'This test should fail');
			test.deepEqual(e, {validationErrors: ['Rule "required" for field `login` has not been successfully validated.', 'Password not strong enough']}, 'This test should fail');
			test.done();
		    });
		},

		maxLen: function(test) {
		    db.models.User.create({login: undefined, password: 'foobar2', mail: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'},  function(e, r, i) {
			test.equal(i, undefined, 'This test should fail');
			test.deepEqual(e, {validationErrors: ['Rule "required" for field `login` has not been successfully validated.', 'Password not strong enough', 'Rule "maxLen" for field `mail` has not been successfully validated.']}, 'This test should fail');
			test.done();
		    });

		},
	    }
	}
    }
}
