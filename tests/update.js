exports.update = {
    noObject: function(test){
	db.models.User.update(function(e, r, i) {
	    test.equal(e, undefined, 'An error occured');
	    test.deepEqual(i, {insertId: 0, affectedRows: 0, numRows: 0, query: 'UPDATE `Users` SET `modifiedAt` = NOW()'}, 'Invalid results object');
	    test.done();
	});
    },

    emptyObject: function(test) {
	db.models.User.update({}, function(e, r, i) {
	    test.equal(e, undefined, 'An error occured');
	    test.deepEqual(i, {insertId: 0, affectedRows: 0, numRows: 0, query: 'UPDATE `Users` SET `modifiedAt` = NOW()'}, 'Invalid results object');
	    test.done();
	});
    }
}
