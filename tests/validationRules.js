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

exports.isIn = function(test) {
  simpleTest('isIn', 'foo', ['foo', 'bar'], function(x) {
    test.equal(x, true);
    simpleTest('isIn', 'foo', ['oof', 'rab'], function(x) {
      test.equal(x, false);
      test.done();
    });
  });
}

exports.isIn = function(test) {
  simpleTest('isIn', 'foo', ['foo', 'bar'], function(x) {
    test.equal(x, true);
    simpleTest('isIn', 'foo', ['oof', 'rab'], function(x) {
      test.equal(x, false);
      test.done();
    });
  });
}

exports.notIn = function(test) {
  simpleTest('notIn', 'foo', ['foo', 'bar'], function(x) {
    test.equal(x, false);
    simpleTest('notIn', 'foo', ['oof', 'rab'], function(x) {
      test.equal(x, true);
      test.done();
    });
  });
}

exports.len = function(test) {
  simpleTest('len', 'foobar', [4, 12], function(x) {
    test.equal(x, true);
    simpleTest('len', 'abcd', [4, 12], function(x) {
      test.equal(x, true);
      simpleTest('len', 'abcdefghijkl', [4, 12], function(x) {
	test.equal(x, true);
	simpleTest('len', 'abcdefghijklm', [4, 12], function(x) {
	  test.equal(x, false);
	  simpleTest('len', 'foo', [4, 12], function(x) {
	    test.equal(x, false);
	    test.done();
	  });
	});
      });
    });
  });
}

exports.minLen = function(test) {
  simpleTest('minLen', 'foobar', 4, function(x) {
    test.equal(x, true);
    simpleTest('minLen', 'abcd', 4, function(x) {
      test.equal(x, true);
      simpleTest('minLen', 'foo', 4, function(x) {
	test.equal(x, false);
	test.done();
      });
    });
  });
}

exports.maxLen = function(test) {
  simpleTest('maxLen', 'foobar', 12, function(x) {
    test.equal(x, true);
    simpleTest('maxLen', 'abcdefghijkl', 12, function(x) {
      test.equal(x, true);
      simpleTest('maxLen', 'abcdefghijklm', 12, function(x) {
	test.equal(x, false);
	test.done();
      });
    });
  });
}

exports.between = function(test) {
  simpleTest('between', 6, [4.2, 12.1], function(x) {
    test.equal(x, true);
    simpleTest('between', 4.2, [4.2, 12.1], function(x) {
      test.equal(x, true);
      simpleTest('between', 12.1, [4.2, 12.1], function(x) {
	test.equal(x, true);
	simpleTest('between', 12.11, [4.2, 12.1], function(x) {
	  test.equal(x, false);
	  simpleTest('between', 4.19, [4.2, 12.1], function(x) {
	    test.equal(x, false);
	    test.done();
	  });
	});
      });
    });
  });
}

exports.min = function(test) {
  simpleTest('min', 6, 4.2, function(x) {
    test.equal(x, true);
    simpleTest('min', 4.2, 4.2, function(x) {
      test.equal(x, true);
      simpleTest('min', 4.19, 4.2, function(x) {
	test.equal(x, false);
	test.done();
      });
    });
  });
}

exports.max = function(test) {
  simpleTest('max', 6, 12.1, function(x) {
    test.equal(x, true);
    simpleTest('max', 12.1, 12.1, function(x) {
      test.equal(x, true);
      simpleTest('max', 12.101, 12.1, function(x) {
	test.equal(x, false);
	test.done();
      });
    });
  });
}
