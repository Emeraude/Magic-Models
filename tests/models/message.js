module.exports = function(db) {
    db.define('Message', {
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
	    validate: {
		len: [8, 255]
	    }
	},
	content: {
	    type: 'text',
	    validate: {
		minLen: 50
	    }
	}
    }, {
	modifiedAt: null
    });
};
