module.exports = {
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
	    }
	}
    }
}
