exports.query = {
    showTables: function(test) {
	db.query('SHOW TABLES', function(e, r, i) {
	    test.equal(e, undefined, e);
	    test.deepEqual({insertId: 0, affectedRows: 0, numRows: 3, query: 'SHOW TABLES'}, i, 'Informations object is incorrect');
	    test.ok(r[0], 'No table found in the database');
	    test.done();
	});
    },

    descTable: function(test) {
	db.query('DESC Users', function(e, r, i) {
	    test.equal(r.length, 6, 'Some fields are missing');
	    test.equal(e, undefined, e);
	    test.done();
	});
    },

    selectFromTable: function(test) {
	db.query('SELECT * FROM Users', function(e, r, i) {
	    test.equal(e, undefined, e);
	    test.equal(r.length, i.numRows);
	    test.done();
	});
    },

    cleaningTables: function(test) {
	db.query('TRUNCATE TABLE Users', function(e, r, i) {
	    test.equal(e, undefined, e);
	    db.query('TRUNCATE TABLE News', function(e, r, i) {
		test.equal(e, undefined, e);
		db.query('TRUNCATE TABLE Messages', function(e, r, i) {
		    test.equal(e, undefined, e);
		    test.done();
		});
	    });
	});
    }
}
