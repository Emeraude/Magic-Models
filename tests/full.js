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
  test.equal('[\\w.]*@\\w*.\\w{2,}', escape(/[\w.]*@\w*.\w{2,}/i), 'Fail test to escape regexp');
  test.equal('NULL', escape(null));
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
