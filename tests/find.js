exports.find = {
    emptyObject: function(test) {
	db.models.User.find({}, function(e, r, i) {
	    test.equal(e, undefined, 'An error occured');
	    test.deepEqual(r, {id: '1', login: 'foobar', password: 'foobar42', mail: null}, 'Invalid results object');
	    test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users` LIMIT 1'}, 'Invalid informations object');
	    test.done();
	});
    },

    where: {
	equal: function(test) {
	    db.models.User.find({where: {login: 'foobar'}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(r, {id: '1', login: 'foobar', password: 'foobar42', mail: null}, 'Invalid results object');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users` WHERE `login` = "foobar" LIMIT 1'}, 'Invalid informations object');
		test.done();
	    });
	},

	"in": function(test) {
	    db.models.User.find({where: {id: [1, 2, 5]}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(r, {id: '1', login: 'foobar', password: 'foobar42', mail: null}, 'Invalid results object');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users` WHERE `id` IN ("1","2","5") LIMIT 1'}, 'Invalid informations object');
		test.done();
	    });
	},

	between: function(test) {
	    db.models.User.find({where: {id: {between: [1, 5]}}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(r, {id: '1', login: 'foobar', password: 'foobar42', mail: null}, 'Invalid results object');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users` WHERE `id` BETWEEN "1" AND "5" LIMIT 1'}, 'Invalid informations object');
		test.done();
	    });
	},

	gte: function(test) {
	    db.models.User.find({where: {id: {gte: 2}}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(r, {id: '2', login: 'barfoo', password: 'foobar42', mail: null}, 'Invalid results object');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users` WHERE `id` >= "2" LIMIT 1'}, 'Invalid informations object');
		test.done();
	    });
	},

	like: function(test) {
	    db.models.User.find({where: {login: {like: "%arfo%"}}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(r, {id: '2', login: 'barfoo', password: 'foobar42', mail: null}, 'Invalid results object');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users` WHERE `login` LIKE "%arfo%" LIMIT 1'}, 'Invalid informations object');
		test.done();
	    });
	},


	match: function(test) {
	    db.models.User.find({where: {login: {match: /foo$/}}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(r, {id: '2', login: 'barfoo', password: 'foobar42', mail: null}, 'Invalid results object');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users` WHERE `login` REGEXP "foo$" LIMIT 1'}, 'Invalid informations object');
		test.done();
	    });
	},

	or: function(test) {
	    db.models.User.find({where: {or: [{login: "foobar"}, {id: 2}]}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(r, {id: '1', login: 'foobar', password: 'foobar42', mail: null}, 'Invalid results object');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users` WHERE ( ( `login` = "foobar" ) OR  ( `id` = "2" ) ) LIMIT 1'}, 'Invalid informations object');
		test.done();
	    });
	},

	complex: function(test) {
	    db.models.User.find({where: {
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
		test.deepEqual(r, {id: '1', login: 'foobar', password: 'foobar42', mail: null}, 'Invalid results object');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users` WHERE ( ( `login` = "foobar" AND `id` = "1" AND `password` = "foobar42" ) OR  ( `login` = "barfoo" AND ( ( `id` = "3" ) OR  ( `id` = "42" ) ) ) ) LIMIT 1'}, 'Invalid informations object');
		test.done();
	    });
	}
    }
}
