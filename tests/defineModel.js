var _ = require('lodash');

exports.defineModels = {
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
	test.deepEqual(db.models.User.fields, {id: {fieldName: 'id', type: 'int', key: 'primary', default: {created: null, modified: null}}, login: {fieldName: 'login', type: 'varchar', length: 32, key: 'unique', validate: [{name: 'len', fun: db.validate.len, val: [4, 32]}, {name: 'is', fun: db.validate.is, val: /^[a-z0-9\-_\.]{4,32}$/i}, {name: 'notIn', fun: db.validate.notIn, val: ['root', 'admin']}, {name: 'isUnique', fun: db.validate.isUnique, val: true}], default: {created: 'anonymous', modified: null}}}, 'Model completion failed');
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
	    test.deepEqual(db.models.User.fields, {id: {fieldName: 'id', type: 'int', key: 'primary', default: {created: null, modified: null}}, login: {fieldName: 'login', type: 'varchar', length: 32, key: 'unique', validate: [{name: 'len', fun: db.validate.len, val: [4, 32]}, {name: 'is', fun: db.validate.is, val: /^[a-z0-9\-_\.]{4,32}$/i}, {name: 'notIn', fun: db.validate.notIn, val: ['root', 'admin']}, {name: 'isUnique', fun: db.validate.isUnique, val: true}], required: true, default: { created: 'anonymous', modified: null}}, password: {fieldName: 'password', type: 'varchar', length: 255, validate: [{msg: 'Password not strong enough', name: 'minLen', fun: db.validate.minLen, val: 8}], required: 'Password not strong enough', default: {created: null, modified: null}}, mail: {fieldName: 'mail', type: 'varchar', length: 255, validate: [{name: 'maxLen', fun: db.validate.maxLen, val: 255}], default: {created: null, modified: null}}}, 'Model `User` not defined correctly');
	    test.equal(db.models.User.table, 'Users', 'Wrong table name for model `User`');
	    test.equal(db.models.User.primaryKey, 'id', 'Wrong primary key for model `User`');
	    test.equal(db.models.User.createdAt, 'createdAt', 'Wrong createdAt field for model `User`');
	    test.equal(db.models.User.modifiedAt, 'modifiedAt', 'Wrong modifiedAt field for model `User`');
	    test.done();
	},

	news: function(test) {
	    test.deepEqual(db.models.News.fields, {id: { fieldName: 'id', type: 'int', key: 'primary', default: {created: null, modified: null}}, userId: {fieldName: 'userId', type: 'int', default: {created: null, modified: null}}, title: {fieldName: 'title', type: 'varchar', length: 255, default: {created: null, modified: null}}, content: {fieldName: 'content', type: 'text', validate: [{name: 'minLen', fun: db.validate.minLen, val: 50, msg: 'Content too short'}], default: {created: null, modified: null}}}, 'Model `News` not defined correctly');
	    test.equal(db.models.News.table, 'News', 'Wrong table name for model `News`');
	    test.equal(db.models.News.primaryKey, 'id', 'Wrong primary key for model `News`');
	    test.equal(db.models.News.createdAt, 'createdAt', 'Wrong createdAt field for model `News`');
	    test.equal(db.models.News.modifiedAt, 'modifiedAt', 'Wrong modifiedAt field for model `News`');
	    test.done();
	},

	message: function(test) {
	    test.deepEqual(db.models.Message.fields, {id: {fieldName: 'id', type: 'int', key: 'primary', default: {created: null, modified: null}}, to: {fieldName: 'to', type: 'int', default: {created: null, modified: null}}, from: {fieldName: 'from', type: 'int', default: {created: null, modified: null}}, title: {fieldName: 'title', type: 'varchar', length: 255, validate: [{name: 'len', fun: db.validate.len, val: [8, 255]}], default: {created: null, modified: null}}, content: {fieldName: 'content', type: 'text', validate: [{name: 'minLen', fun: db.validate.minLen, val: 50}], default: {created: null, modified: null}}}, 'Model `Message` not defined correctly');
	    test.equal(db.models.Message.table, 'Messages', 'Wrong table name for model `Message`');
	    test.equal(db.models.Message.primaryKey, 'id', 'Wrong primary key for model `Message`');
	    test.equal(db.models.Message.createdAt, 'createdAt', 'Wrong createdAt field for model `Message`');
	    test.equal(db.models.Message.modifiedAt, null, 'Wrong modifiedAt field for model `Message`');
	    test.done();
	}
    }
}
