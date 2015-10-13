#!/usr/bin/env nodeunit

var rules = require('../lib/validationRules');

function simpleTest(rule, user, arg, cb) {
  rules[rule]({checkedField: {val: user},
    rule: {val: arg}}, cb);
}

exports.is = {
  regexp: function(test) {
    simpleTest('is', 'foo', /^.*$/, function(x) {
      test.equal(x, true);
      simpleTest('is', 'foo', /[a-z]/i, function(x) {
	test.equal(x, true);
	simpleTest('is', 'foo', /[A-Z]/, function(x) {
	  test.equal(x, false);
	  test.done();
	});
      });
    });
  },
  string: function(test) {
    simpleTest('is', 'foo', '^.*$', function(x) {
      test.equal(x, true);
      simpleTest('is', 'foo', '[a-z]', function(x) {
	test.equal(x, true);
	simpleTest('is', 'foo', '[A-Z]', function(x) {
	  test.equal(x, false);
	  test.done();
	});
      });
    });
  }
}


exports.not = {
  regexp: function(test) {
    simpleTest('not', 'foo', /^.*$/, function(x) {
      test.equal(x, false);
      simpleTest('not', 'foo', /[a-z]/i, function(x) {
	test.equal(x, false);
	simpleTest('not', 'foo', /[A-Z]/, function(x) {
	  test.equal(x, true);
	  test.done();
	});
      });
    });
  },
  string: function(test) {
    simpleTest('not', 'foo', '^.*$', function(x) {
      test.equal(x, false);
      simpleTest('not', 'foo', '[a-z]', function(x) {
	test.equal(x, false);
	simpleTest('not', 'foo', '[A-Z]', function(x) {
	  test.equal(x, true);
	  test.done();
	});
      });
    });
  }
}
