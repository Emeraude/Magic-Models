exports.all = {
    noObject: function(test) {
	db.models.User.all(function(e, r, i) {
	    test.equal(e, undefined, 'An error occured');
	    test.deepEqual(r, [{id: '1', login: 'foobar', password: 'foobar42', mail: null},
			       {id: '2', login: 'barfoo', password: 'foobar42', mail: null}], 'Invalid results object');
	    test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 2, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users`'}, 'Invalid informations object');
	    test.done();
	});
    },

    emptyObject: function(test) {
	db.models.User.all({}, function(e, r, i) {
	    test.equal(e, undefined, 'An error occured');
	    test.deepEqual(r, [{id: '1', login: 'foobar', password: 'foobar42', mail: null},
			       {id: '2', login: 'barfoo', password: 'foobar42', mail: null}], 'Invalid results object');
	    test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 2, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users`'}, 'Invalid informations object');
	    test.done();
	});
    },

    where: {
	equal: function(test) {
	    db.models.User.all({where: {login: 'foobar'}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(r, [{id: '1', login: 'foobar', password: 'foobar42', mail: null}], 'Invalid results object');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users` WHERE `login` = "foobar"'}, 'Invalid informations object');
		test.done();
	    });
	},

	"in": function(test) {
	    db.models.User.all({where: {id: [1, 2, 5]}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(r, [{id: '1', login: 'foobar', password: 'foobar42', mail: null},
				   {id: '2', login: 'barfoo', password: 'foobar42', mail: null}], 'Invalid results object');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 2, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users` WHERE `id` IN ("1","2","5")'}, 'Invalid informations object');
		test.done();
	    });
	},

	between: function(test) {
	    db.models.User.all({where: {id: {between: [1, 5]}}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(r, [{id: '1', login: 'foobar', password: 'foobar42', mail: null},
				   {id: '2', login: 'barfoo', password: 'foobar42', mail: null}], 'Invalid results object');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 2, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users` WHERE `id` BETWEEN "1" AND "5"'}, 'Invalid informations object');
		test.done();
	    });
	},

	gte: function(test) {
	    db.models.User.all({where: {id: {gte: 2}}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(r, [{id: '2', login: 'barfoo', password: 'foobar42', mail: null}], 'Invalid results object');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users` WHERE `id` >= "2"'}, 'Invalid informations object');
		test.done();
	    });
	},

	like: function(test) {
	    db.models.User.all({where: {login: {like: "%arfo%"}}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(r, [{id: '2', login: 'barfoo', password: 'foobar42', mail: null}], 'Invalid results object');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users` WHERE `login` LIKE "%arfo%"'}, 'Invalid informations object');
		test.done();
	    });
	},


	match: function(test) {
	    db.models.User.all({where: {login: {match: /foo$/}}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(r, [{id: '2', login: 'barfoo', password: 'foobar42', mail: null}], 'Invalid results object');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users` WHERE `login` REGEXP "foo$"'}, 'Invalid informations object');
		test.done();
	    });
	},

	or: function(test) {
	    db.models.User.all({where: {or: [{login: "foobar"}, {id: 2}]}}, function(e, r, i) {
		test.equal(e, undefined, 'An error occured');
		test.deepEqual(r, [{id: '1', login: 'foobar', password: 'foobar42', mail: null},
				   {id: '2', login: 'barfoo', password: 'foobar42', mail: null}], 'Invalid results object');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 2, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users` WHERE ( ( `login` = "foobar" ) OR  ( `id` = "2" ) )'}, 'Invalid informations object');
		test.done();
	    });
	},

	complex: function(test) {
	    db.models.User.all({where: {
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
		test.deepEqual(r, [{id: '1', login: 'foobar', password: 'foobar42', mail: null}], 'Invalid results object');
		test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users` WHERE ( ( `login` = "foobar" AND `id` = "1" AND `password` = "foobar42" ) OR  ( `login` = "barfoo" AND ( ( `id` = "3" ) OR  ( `id` = "42" ) ) ) )'}, 'Invalid informations object');
		test.done();
	    });
	}
    }
}
