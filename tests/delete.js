exports.delete = {
    deleteOne: function(test) {
	db.models.User.delete({id: 2}, function(e, r, i) {
	    test.equal(e, undefined, 'An error occured');
	    test.deepEqual(i, {insertId: 0, affectedRows: 1, numRows: 0, query: 'DELETE FROM `Users` WHERE `id` = "2"'}, 'Invalid informations object');
	    test.done();
	});
    },

    emptyObject: function(test) {
	db.models.User.delete({}, function(e, r, i) {
	    test.equal(e, undefined, 'An error occured');
	    test.deepEqual(i, {insertId: 0, affectedRows: 1, numRows: 0, query: 'DELETE FROM `Users`'}, 'Invalid informations object');
	    test.done();
	});
    },

    noObject: function(test) {
	db.models.User.delete(function(e, r, i) {
	    test.equal(e, undefined, 'An error occured');
	    test.deepEqual(i, {insertId: 0, affectedRows: 0, numRows: 0, query: 'DELETE FROM `Users`'}, 'Invalid informations object');
	    test.done();
	});
    }
}
