exports.create = {
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
		db.models.User.create({login: '$$$$$$$$$$$$'}, function(e, r, i) {
		    test.equal(i, undefined, 'This test should fail');
		    test.deepEqual(e, {validationErrors: ['Rule "is" for field `login` has not been successfully validated.', 'Password not strong enough']}, 'This test should fail');
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
    },
    goodTests: {
	newUser: function(test) {
	    db.models.User.create({login: 'foobar', password: 'foobar42'}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(i, {insertId: 1, affectedRows: 1, numRows: 0, query: 'INSERT INTO `Users`(`login`, `password`, `createdAt`, `modifiedAt`) VALUES("foobar", "foobar42", NOW(), NOW())'}, 'Invalid informations object');
		test.deepEqual(r, {login: 'foobar', password: 'foobar42', id: 1}, 'Invalid results object');
		test.done();
	    });
	},

	newMessage: function(test) {
	    db.models.Message.create({to: 1, from: 1, title: 'First message', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit.'}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(i, {insertId: 1, affectedRows: 1, numRows: 0, query: 'INSERT INTO `Messages`(`to`, `from`, `title`, `content`, `createdAt`) VALUES("1", "1", "First message", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit.", NOW())'}, 'Invalid informations object');
		    test.deepEqual(r, {to: 1, from: 1, title: 'First message',content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit.', id: 1}, 'Invalid results object');
		test.done();
	    });
	},

	newNews: function(test) {
	    db.models.News.create({userId: 1, title: 'First news', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit.'}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(i, {insertId: 1, affectedRows: 1, numRows: 0, query: 'INSERT INTO `News`(`userId`, `title`, `content`, `createdAt`, `modifiedAt`) VALUES("1", "First news", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit.", NOW(), NOW())'}, 'Invalid informations object');
		test.deepEqual(r, {userId: 1, title: 'First news', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit.', id: 1} , 'Invalid results object');
		test.done();
	    });
	}
    },

    nonUnique: function(test) {
	db.models.User.create({login: 'foobar', password: 'foobar42'}, function(e, r, i) {
	    test.equal(i, undefined, 'This test should fail');
	    test.deepEqual(e, {validationErrors: ['Rule "isUnique" for field `login` has not been successfully validated.']}, 'This test should fail');
	    test.done();
	});
    }
}
