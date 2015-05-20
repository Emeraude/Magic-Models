exports.describe = {
    user: function(test) {
	db.models.User.describe(function(e, r, i) {
	    test.equal(e, undefined, 'An error occured');
	    test.deepEqual(r, {id: {Type: 'int(11)', Null: 'NO', Key: 'PRI', Default: null, Extra: 'auto_increment'}, login: {Type: 'varchar(32)', Null: 'NO', Key: '', Default: null, Extra: ''}, mail: {Type: 'varchar(255)', Null: 'YES', Key: '', Default: null, Extra: ''}, password: {Type: 'varchar(255)', Null: 'YES', Key: '', Default: null, Extra: '' }, createdAt: {Type: 'timestamp', Null: 'NO', Key: '', Default: 'CURRENT_TIMESTAMP', Extra: ''}, modifiedAt: {Type: 'timestamp', Null: 'NO', Key: '', Default: 'CURRENT_TIMESTAMP', Extra: ''}}, 'Invalid results object');
	    test.deepEqual(i, {insertId: 0, affectedRows: 0, numRows: 6, query: 'DESCRIBE `Users`'}, 'Invalid informations object');
	    test.done();
	});
    },

    news: function(test) {
	db.models.News.describe(function(e, r, i) {
	    test.equal(e, undefined, 'An error occured');
	    test.deepEqual(r, {id: {Type: 'int(11)', Null: 'NO', Key: 'PRI', Default: null, Extra: 'auto_increment'}, userId: {Type: 'int(11)', Null: 'NO', Key: '', Default: null, Extra: ''}, title: {Type: 'varchar(255)',  Null: 'NO', Key: '', Default: null,  Extra: ''}, content: {Type: 'text', Null: 'NO', Key: '', Default: null, Extra: ''}, createdAt: {Type: 'timestamp', Null: 'NO', Key: '', Default: 'CURRENT_TIMESTAMP', Extra: ''}, modifiedAt: {Type: 'timestamp', Null: 'NO', Key: '', Default: 'CURRENT_TIMESTAMP', Extra: ''}}, 'Invalid results object');
	    test.deepEqual(i, {insertId: 0, affectedRows: 0, numRows: 6, query: 'DESCRIBE `News`'}, 'Invalid informations object');
	    test.done();
	});
    },

    message: function(test) {
	db.models.Message.describe(function(e, r, i) {
	    test.equal(e, undefined, 'An error occured');
	    test.deepEqual(r, {id: {Type: 'int(11)', Null: 'NO', Key: 'PRI', Default: null, Extra: 'auto_increment'}, from: {Type: 'int(11)', Null: 'NO', Key: '', Default: null, Extra: ''}, to: {Type: 'int(11)', Null: 'NO', Key: '', Default: null, Extra: ''}, title: {Type: 'varchar(255)',  Null: 'NO', Key: '', Default: null,  Extra: ''}, content: {Type: 'text', Null: 'NO', Key: '', Default: null, Extra: ''}, createdAt: {Type: 'timestamp', Null: 'NO', Key: '', Default: 'CURRENT_TIMESTAMP', Extra: ''}}, 'Invalid results object');
	    test.deepEqual(i, {insertId: 0, affectedRows: 0, numRows: 6, query: 'DESCRIBE `Messages`'}, 'Invalid informations object');
	    test.done();
	});
    }
}
