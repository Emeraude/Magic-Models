#!/usr/bin/env nodeunit

var db = require('../lib/index.js')({
  host: 'localhost',
  user: 'root',
  password: 'toor'
});
var hooks = require('../lib/hooks.js');

exports.define = {
  empty: function(test) {
    db.on('ready', function() {
      db.define('Empty', {});
      test.deepEqual({fields: {}, table: 'Empties', primaryKey: null, createdAt: 'createdAt', modifiedAt: 'modifiedAt', find: db.Empty.find, create: db.Empty.create, update: db.Empty.update, delete: db.Empty.delete, describe: db.Empty.describe, hooks: {beforeValidate: hooks.beforeValidate, afterValidate: hooks.afterValidate, beforeCreate: hooks.beforeCreate, afterCreate: hooks.afterCreate, beforeUpdate: hooks.beforeUpdate, afterUpdate: hooks.afterUpdate, beforeDelete: hooks.beforeDelete, afterDelete: hooks.afterDelete, beforeFind: hooks.beforeFind, afterFind: hooks.afterFind}}, db.Empty);
      test.done();
    });
  },

  fields: {
    default: function(test) {
      db.define('User', {login: {default: 'foo'}})
      test.deepEqual({created: 'foo', modified: null}, db.User.fields.login.default);
      db.define('User', {login: {default: ['oof', 'rab']}})
      test.deepEqual({created: 'oof', modified: 'rab'}, db.User.fields.login.default);
      db.define('User', {login: {default: ['foo-bar']}})
      test.deepEqual({created: 'foo-bar', modified: 'foo-bar'}, db.User.fields.login.default);
      db.define('User', {login: {default: {created: 'foo', modified: 'bar'}}})
      test.deepEqual({created: 'foo', modified: 'bar'}, db.User.fields.login.default);
      db.define('User', {login: {defaultCreated: 'oof'}})
      test.deepEqual({created: 'oof', modified: 'bar'}, db.User.fields.login.default);
      db.define('User', {login: {defaultModified: 'rab'}})
      test.deepEqual({created: 'oof', modified: 'rab'}, db.User.fields.login.default);
      db.define('User', {login: {defaultBoth: 'foo-bar'}})
      test.deepEqual({created: 'foo-bar', modified: 'foo-bar'}, db.User.fields.login.default);
      test.done();
    }
  },

  options: {
    erase: function(test) {
      db.define('Empty', {}, {erase: true});
    test.deepEqual({fields: {}, table: 'Empties', primaryKey: null, createdAt: 'createdAt', modifiedAt: 'modifiedAt', find: db.Empty.find, create: db.Empty.create, update: db.Empty.update, delete: db.Empty.delete, describe: db.Empty.describe, hooks: {beforeValidate: hooks.beforeValidate, afterValidate: hooks.afterValidate, beforeCreate: hooks.beforeCreate, afterCreate: hooks.afterCreate, beforeUpdate: hooks.beforeUpdate, afterUpdate: hooks.afterUpdate, beforeDelete: hooks.beforeDelete, afterDelete: hooks.afterDelete, beforeFind: hooks.beforeFind, afterFind: hooks.afterFind}}, db.Empty);
      test.done();
    }
  }
}

exports.load = function(test) {
  db.load('models');
  test.deepEqual({id: {fieldName: 'id', default: {created: null, modified: null}},
		 userId: {fieldName: 'userId', default: {created: null, modified: null}},
		 title:	{fieldName: 'title', default: {created: null, modified: null}},
		  content: {fieldName: 'content', default: {created: null, modified: null}, required: true}}, db.News.fields);
  test.equal('object', typeof db.Message);
  test.equal('object', typeof db.Member);
  test.done();
}

exports.use = {
  std: function(test) {
    db.use('testDb', function(e, r, i) {
      test.equal(i.query, 'USE `testDb`');
      test.done();
    });
  },
  escape: function(test) {
    db.use('buggy`Db', function(e, r, i) {
      test.equal(i.query, 'USE `buggy``Db`');
      test.done();
    });
  }
}

exports.query = function(test) {
  db.query('SELECT * FROM `foobar`', function(e, r, i) {
    test.equal('SELECT * FROM `foobar`', i.query);
    test.equal('number', typeof i.insertId);
    test.equal('number', typeof i.affectedRows);
    test.equal('number', typeof i.numRows);
    test.equal('number', typeof i.totalTime);
    test.equal('number', typeof i.queryTime);
    test.done();
  });
}

exports.find = {
  noOptions: function(test) {
    db.User.find(function(e, r, i) {
      test.equal('SELECT `login` AS `login` FROM `Users`', i.query);
      test.done();
    });
  },
  fields: function(test) {
    db.User.find({fields: ['login']}, function(e, r, i) {
      test.equal('SELECT `login` AS `login` FROM `Users`', i.query);
      test.done();
    });
  },
  missingField: function(test) {
    db.User.find({fields: ['mail']}, function(e, r, i) {
      test.equal('SELECT `mail` AS `mail` FROM `Users`', i.query);
      test.done();
    });
  },
  aggregates: function(test) {
    db.User.find({fields: [{'upper': 'login'}]}, function(e, r, i) {
      test.equal('SELECT UPPER(`login`) AS upperLogin FROM `Users`', i.query);
      db.User.find({fields: [{'count': '*'}]}, function(e, r, i) {
	test.equal('SELECT COUNT(*) AS countAll FROM `Users`', i.query);
	test.done();
      });
    });
  },
  full: function(test) {
    db.User.find({fields: ['login', {'upper': 'login'}],
		  where: {id: 42, login: 'admin'},
		  group: ['login', 'mail'],
		  order: {login: 'asc', mail: 'desc'},
		  limit: 5, offset: 2}, function(e, r, i) {
		    test.equal('SELECT `login` AS `login`, UPPER(`login`) AS upperLogin FROM `Users` WHERE `id` = 42 AND `login` = "admin" GROUP BY `login`, `mail` ORDER BY `login` ASC, `mail` DESC LIMIT 5 OFFSET 2', i.query);
		    test.done();
		  });
  }
}

exports.create = {
  noOptions: function(test) {
    db.User.create(function(e, r, i) {
      test.equal('INSERT INTO `Users`(`login`, `createdAt`, `modifiedAt`) VALUES("foo-bar", NOW(), NOW())', i.query);
      test.done();
    });
  },
  fields: function(test) {
    db.User.create({login: 'root'}, function(e, r, i) {
      test.equal('INSERT INTO `Users`(`login`, `createdAt`, `modifiedAt`) VALUES("root", NOW(), NOW())', i.query);
      test.done();
    });
  },
  missingField: function(test) {
    db.User.create({mail: 'root@example.com'}, function(e, r, i) {
      test.equal('INSERT INTO `Users`(`mail`, `login`, `createdAt`, `modifiedAt`) VALUES("root@example.com", "foo-bar", NOW(), NOW())', i.query);
      test.done();
    });
  }
}

exports.update = {
  noOptions: function(test) {
    db.User.update(function(e, r, i) {
      test.equal('UPDATE `Users` SET `login` = "foo-bar", `modifiedAt` = NOW()', i.query);
      test.done();
    });
  },
  fields: function(test) {
    db.User.update({values: {login: 'root'}}, function(e, r, i) {
      test.equal('UPDATE `Users` SET `login` = "root", `modifiedAt` = NOW()', i.query);
      test.done();
    });
  },
  missingField: function(test) {
    db.User.update({values: {mail: 'root@example.com'}}, function(e, r, i) {
      test.equal('UPDATE `Users` SET `mail` = "root@example.com", `login` = "foo-bar", `modifiedAt` = NOW()', i.query);
      test.done();
    });
  },
  full: function(test) {
    db.User.update({values: {login: 'root'}, where: {id: 5}}, function(e, r, i) {
      test.equal('UPDATE `Users` SET `login` = "root", `modifiedAt` = NOW() WHERE `id` = 5', i.query);
      test.done();
    });
  }
}

exports.delete = {
  noOptions: function(test) {
    db.User.delete(function(e, r, i) {
      test.equal('DELETE FROM `Users`', i.query);
      test.done();
    });
  },
  where: function(test) {
    db.User.delete({login: 'root'}, function(e, r, i) {
      test.equal('DELETE FROM `Users` WHERE `login` = "root"', i.query);
      test.done();
    });
  }
}

exports.describe = function(test) {
  db.User.describe(function(e, r, i) {
    test.equal('DESCRIBE `Users`', i.query);
    test.done();
  });
}

exports.exit = function(test) {
  db.exit();
  test.done();
}
