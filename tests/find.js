exports.find = {
    emptyObject: function(test) {
	db.models.User.find({}, function(e, r, i) {
	    test.equal(e, undefined, 'An error occured');
	    test.deepEqual(r, {id: '1', login: 'foobar', password: 'foobar42', mail: null}, 'Invalid results object');
	    test.deepEqual(i, {insertId: 1, affectedRows: 0, numRows: 1, query: 'SELECT `id` AS `id`, `login` AS `login`, `password` AS `password`, `mail` AS `mail` FROM `Users` LIMIT 1'}, 'Invalid informations object');
	    test.done();
	});
    }
}
