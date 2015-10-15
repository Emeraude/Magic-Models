#!/usr/bin/env nodeunit

var db = require('../lib/index.js')({
  host: 'localhost',
  user: 'root',
  password: 'toor'
});
var aliases = require('./aliases.json');
var hooks = require('../lib/hooks.js');

exports.escape = function(test) {
  var escape = require('../lib/escape.js');

  test.equal('42', escape(42), 'Fail test to escape int');
  test.equal('true', escape(true), 'Fail test to escape bool');
  test.equal('"\\\\foo\\nbar\\r\\\'\\\\"', escape("\\foo\nbar\r'\\"), 'Fail test to escape string');
  test.equal('2015-08-13 01:17:44', escape(new Date('Thu Aug 13 2015 01:17:44')), 'Fail test to escape date');
  test.equal('"[\\\\w.]*@\\\\w*.\\\\w{2,}"', escape(/[\w.]*@\w*.\w{2,}/i), 'Fail test to escape regexp');
  test.equal('NULL', escape(null));
  test.done();
}

exports.where = {
  standard: function(test) {
    var where = require('../lib/where.js');

    test.equal('`id` = 42', where({id: 42}));
    test.equal('`id` = 42 AND `login` = "admin"', where({id: 42, login: 'admin'}));
    test.equal('`id` IN(1, 5)', where({id: [1, 5]}));
    test.equal('`id` BETWEEN 1 AND 5', where({id: {between: [1, 5]}}));
    test.equal('`id` > 5', where({id: {gt: 5}}));
    test.equal('`id` >= 5', where({id: {gte: 5}}));
    test.equal('`id` < 5', where({id: {lt: 5}}));
    test.equal('`id` <= 5', where({id: {lte: 5}}));
    test.equal('`id` != 5', where({id: {ne: 5}}));
    test.equal('`id` = 5', where({id: {eq: 5}}));
    test.equal('`id` NOT 5', where({id: {not: 5}}));
    test.equal('`login` LIKE "%admin%"', where({login: {like: "%admin%"}}));
    test.equal('`login` REGEXP "[a-z]*"', where({login: {match: /[a-z]*/i}}));
    test.equal('((`id` = 5) OR (`login` = "admin"))', where({or: [{id: 5}, {login: "admin"}]}));
    test.equal('((`type` = "dog" AND `color` = "white" AND `size` = "large") OR (`type` = "cat" AND ((`size` = "small") OR (`color` = "black"))))', where({or:[{type: 'dog', color: 'white', size: 'large'}, {type: 'cat', or: [{size: 'small'}, {color: 'black'}]}]}));
    test.done();
  },

  aliases: function(test) {
    var where = require('../lib/where.js');
    test.equal('`ID` = 42', where({id: 42}, aliases));
    test.equal('`ID` = 42 AND `userName` = "admin"', where({id: 42, login: 'admin'}, aliases));
    test.equal('`ID` IN(1, 5)', where({id: [1, 5]}, aliases));
    test.equal('`ID` BETWEEN 1 AND 5', where({id: {between: [1, 5]}}, aliases));
    test.equal('`ID` > 5', where({id: {gt: 5}}, aliases));
    test.equal('`ID` >= 5', where({id: {gte: 5}}, aliases));
    test.equal('`ID` < 5', where({id: {lt: 5}}, aliases));
    test.equal('`ID` <= 5', where({id: {lte: 5}}, aliases));
    test.equal('`ID` != 5', where({id: {ne: 5}}, aliases));
    test.equal('`ID` = 5', where({id: {eq: 5}}, aliases));
    test.equal('`ID` NOT 5', where({id: {not: 5}}, aliases));
    test.equal('`userName` LIKE "%admin%"', where({login: {like: "%admin%"}}, aliases));
    test.equal('`userName` REGEXP "[a-z]*"', where({login: {match: /[a-z]*/i}}, aliases));
    test.equal('((`ID` = 5) OR (`userName` = "admin"))', where({or: [{id: 5}, {login: "admin"}]}, aliases));
    test.equal('((`type` = "dog" AND `color` = "white" AND `size` = "large") OR (`type` = "cat" AND ((`size` = "small") OR (`color` = "black"))))', where({or:[{type: 'dog', color: 'white', size: 'large'}, {type: 'cat', or: [{size: 'small'}, {color: 'black'}]}]}, aliases));
    test.done();
  },

  randomCase: function(test) {
    var where = require('../lib/where.js');

    test.equal('`id` BETWEEN 1 AND 5', where({id: {betWEEn: [1, 5]}}));
    test.equal('`id` > 5', where({id: {gT: 5}}));
    test.equal('`id` >= 5', where({id: {GTe: 5}}));
    test.equal('`id` < 5', where({id: {lT: 5}}));
    test.equal('`id` <= 5', where({id: {lTe: 5}}));
    test.equal('`id` != 5', where({id: {nE: 5}}));
    test.equal('`id` = 5', where({id: {eQ: 5}}));
    test.equal('`id` NOT 5', where({id: {NOt: 5}}));
    test.equal('`login` LIKE "%admin%"', where({login: {lIKe: "%admin%"}}));
    test.equal('`login` REGEXP "[a-z]*"', where({login: {maTCH: /[a-z]*/i}}));
    test.equal('((`id` = 5) OR (`login` = "admin"))', where({oR: [{id: 5}, {login: "admin"}]}));
    test.done();
  }
}

var queryBuilder = require('../lib/queryBuilder.js');
exports.queryBuilder = {
  where: function(test) {
    test.equal(' WHERE `id` = 42 AND `login` = "admin"', queryBuilder({where: {id: 42, login: 'admin'}}));
    test.done();
  },

  group: function(test) {
    test.equal(' GROUP BY `login`', queryBuilder({group: 'login'}));
    test.equal(' GROUP BY `login`, `mail`', queryBuilder({group: ['login', 'mail']}));
    test.equal(' GROUP BY `userName`', queryBuilder({group: 'login'}, aliases));
    test.equal(' GROUP BY `userName`, `email`', queryBuilder({group: ['login', 'mail']}, aliases));
    test.done();
  },

  order: {
    standard: function(test) {
      test.equal(' ORDER BY `login` ASC', queryBuilder({order: {login: 'asc'}}));
      test.equal(' ORDER BY `login` ASC, `mail` DESC', queryBuilder({order: {login: 'asc', mail: 'desc'}}));
      test.equal(' ORDER BY `userName` ASC', queryBuilder({order: {login: 'asc'}}, aliases));
      test.equal(' ORDER BY `userName` ASC, `email` DESC', queryBuilder({order: {login: 'asc', mail: 'desc'}}, aliases));
      test.done();
    },
    randomCase: function(test) {
      test.equal(' ORDER BY `login` ASC', queryBuilder({order: {login: 'ASc'}}));
      test.equal(' ORDER BY `login` ASC, `mail` DESC', queryBuilder({order: {login: 'aSC', mail: 'Desc'}}));
      test.equal(' ORDER BY `userName` ASC', queryBuilder({order: {login: 'aSc'}}, aliases));
      test.equal(' ORDER BY `userName` ASC, `email` DESC', queryBuilder({order: {login: 'asC', mail: 'DESc'}}, aliases));
      test.done();
    }
  },

  limit: function(test) {
    test.equal(' LIMIT 5', queryBuilder({limit: 5}));
    test.equal(' LIMIT 5 OFFSET 2', queryBuilder({limit: 5, offset: 2}));
    test.equal('', queryBuilder({offset: 2}));
    test.done();
  },

  full: function(test) {
    test.equal(' WHERE `id` = 42 AND `login` = "admin" GROUP BY `login`, `mail` ORDER BY `login` ASC, `mail` DESC LIMIT 5 OFFSET 2', queryBuilder({where: {id: 42, login: 'admin'}, group: ['login', 'mail'], order: {login: 'asc', mail: 'desc'}, limit: 5, offset: 2}));
    test.equal(' WHERE `ID` = 42 AND `userName` = "admin" GROUP BY `userName`, `email` ORDER BY `userName` ASC, `email` DESC LIMIT 5 OFFSET 2', queryBuilder({where: {id: 42, login: 'admin'}, group: ['login', 'mail'], order: {login: 'asc', mail: 'desc'}, limit: 5, offset: 2}, aliases));
    test.done();
  }
}

exports.define = {
  empty: function(test) {
    db.define('Empty', {});
    test.deepEqual({fields: {}, table: 'Empties', primaryKey: null, createdAt: 'createdAt', modifiedAt: 'modifiedAt', find: db.Empty.find, create: db.Empty.create, update: db.Empty.update, delete: db.Empty.delete, describe: db.Empty.describe, hooks: {beforeValidate: hooks.beforeValidate, afterValidate: hooks.afterValidate, beforeCreate: hooks.beforeCreate, afterCreate: hooks.afterCreate, beforeUpdate: hooks.beforeUpdate, afterUpdate: hooks.afterUpdate, beforeDelete: hooks.beforeDelete, afterDelete: hooks.afterDelete, beforeFind: hooks.beforeFind, afterFind: hooks.afterFind}}, db.Empty);
    test.done();
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
