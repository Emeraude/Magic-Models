exports.update = {
    noObject: function(test){
	db.models.User.update(function(e, r, i) {
	    test.equal(e, undefined, 'An error occured');
	    i.affectedRows = 0;
	    test.deepEqual(i, {insertId: 0, affectedRows: 0, numRows: 0, query: 'UPDATE `Users` SET `modifiedAt` = NOW()'}, 'Invalid results object');
	    test.done();
	});
    },

    emptyObject: function(test) {
	db.models.User.update({}, function(e, r, i) {
	    test.equal(e, undefined, 'An error occured');
	    i.affectedRows = 0;
	    test.deepEqual(i, {insertId: 0, affectedRows: 0, numRows: 0, query: 'UPDATE `Users` SET `modifiedAt` = NOW()'}, 'Invalid results object');
	    test.done();
	});
    },

    allRows: function(test) {
	db.models.User.update({values: {password: 'barfoo1337'}}, function(e, r, i) {
	    test.equal(e, undefined, 'An error occured');
	    test.deepEqual(i, {insertId: 0, affectedRows: 2, numRows: 0, query: 'UPDATE `Users` SET `password` = "barfoo1337", `modifiedAt` = NOW()'}, 'Invalid results object');
	    test.done();
	});
    },

    oneRow: function(test) {
	db.models.User.update({values: {login: 'maria'}, where: {id: 1}}, function(e, r, i) {
	    test.equal(e, undefined, 'An error occured');
	    test.deepEqual(i, {insertId: 0, affectedRows: 1, numRows: 0, query: 'UPDATE `Users` SET `login` = "maria", `modifiedAt` = NOW() WHERE `id` = "1"'}, 'Invalid results object');
	    test.done();
	});
    }
}
