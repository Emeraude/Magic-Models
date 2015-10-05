#!/usr/bin/env nodeunit

var db = require('../lib/index.js')({
  host: 'localhost',
  user: 'root',
  password: 'toor'
});

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

exports.where = function(test) {
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
}

exports.use = function(test) {
  db.on('ready', function() {
    db.use('testDb', function(e, r, i) {
      test.equal(i.query, 'USE `testDb`');
      db.use('buggy`Db', function(e, r, i) {
	test.equal(i.query, 'USE `buggy``Db`');
	test.done();
      });
    });
  });
}

exports.query = function(test) {
  db.query('SELECT * FROM `foobar`', function(e, r, i) {
    test.equal('SELECT * FROM `foobar`', i.query);
    test.done();
  });
}

exports.define = {
  empty: function(test) {
    db.define('Empty', {});
    test.deepEqual({fields: {}, table: 'Empties', hooks: {}, primaryKey: null, createdAt: 'createdAt', modifiedAt: 'modifiedAt'}, db.Empty);
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
      db.define('User', {}, {erase: true});
      test.deepEqual({fields: {}, table: 'Users', hooks: {}, primaryKey: null, createdAt: 'createdAt', modifiedAt: 'modifiedAt'}, db.User);
      test.done();
    }
  }
}
