exports.count = {
    noObject: function(test) {
	db.models.User.count(function(e, r, i) {
	    test.equal(e, undefined, 'An error occured');
	    test.equal(r, 2, 'Invalid result');
	    test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT COUNT(*) AS count FROM `Users`'}, 'Invalid informations object');
	    test.done();
	});
    },

    emptyObject: function(test) {
	db.models.User.count({}, function(e, r, i) {
	    test.equal(e, undefined, 'An error occured');
	    test.equal(r, 2, 'Invalid result');
	    test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT COUNT(*) AS count FROM `Users`'}, 'Invalid informations object');
	    test.done();
	});
    },

    where: {
	equal: function(test) {
	    db.models.User.count({where: {login: 'foobar'}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.equal(r, 1, 'Invalid result');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT COUNT(*) AS count FROM `Users` WHERE `login` = "foobar"'}, 'Invalid informations object');
		test.done();
	    });
	},

	"in": function(test) {
	    db.models.User.count({where: {id: [1, 2, 5]}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.equal(r, 2, 'Invalid result');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT COUNT(*) AS count FROM `Users` WHERE `id` IN ("1","2","5")'}, 'Invalid informations object');
		test.done();
	    });
	},

	between: function(test) {
	    db.models.User.count({where: {id: {between: [1, 5]}}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.equal(r, 2, 'Invalid result');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT COUNT(*) AS count FROM `Users` WHERE `id` BETWEEN "1" AND "5"'}, 'Invalid informations object');
		test.done();
	    });
	},

	gte: function(test) {
	    db.models.User.count({where: {id: {gte: 2}}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(r, 1, 'Invalid result');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT COUNT(*) AS count FROM `Users` WHERE `id` >= "2"'}, 'Invalid informations object');
		test.done();
	    });
	},

	like: function(test) {
	    db.models.User.count({where: {login: {like: "%arfo%"}}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(r, 1, 'Invalid result');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT COUNT(*) AS count FROM `Users` WHERE `login` LIKE "%arfo%"'}, 'Invalid informations object');
		test.done();
	    });
	},


	match: function(test) {
	    db.models.User.count({where: {login: {match: /foo$/}}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(r, 1, 'Invalid result');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT COUNT(*) AS count FROM `Users` WHERE `login` REGEXP "foo$"'}, 'Invalid informations object');
		test.done();
	    });
	},

	or: function(test) {
	    db.models.User.count({where: {or: [{login: "foobar"}, {id: 2}]}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.equal(r, 2, 'Invalid result');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT COUNT(*) AS count FROM `Users` WHERE ( ( `login` = "foobar" ) OR  ( `id` = "2" ) )'}, 'Invalid informations object');
		test.done();
	    });
	},

	complex: function(test) {
	    db.models.User.count({where: {
		or: [
		    {login: 'foobar', id: '1', password: 'foobar42'},
		    {login: 'barfoo', or: [
			{id: 3},
			{id: 42}
		    ]
		    }
		]
	    }}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.equal(r, 1, 'Invalid result');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT COUNT(*) AS count FROM `Users` WHERE ( ( `login` = "foobar" AND `id` = "1" AND `password` = "foobar42" ) OR  ( `login` = "barfoo" AND ( ( `id` = "3" ) OR  ( `id` = "42" ) ) ) )'}, 'Invalid informations object');
		test.done();
	    });
	}
    }
}
