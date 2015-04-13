module.exports = function(db) {
    db.define('News', {
	id: {
	    type: 'int',
	    key: 'primary'
	},
	userId: {
	    type: 'int'
	},
	title: {
	    type: 'varchar',
	    length: 255,
	},
	content: {
	    type: 'text',
	    validate: {
		minLen: {
		    val: 50,
		    msg: 'Content too short'
		}
	    }
	}
    }, {
	tableName: 'News'
    });
};
