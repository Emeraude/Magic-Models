module.exports = function(db) {
    db.define('User', {
	id: {
	    type: 'int',
	    key: 'primary'
	},
	login: {
	    type: 'varchar',
	    length: 32,
	    key: 'unique',
	    validate: {
		len: [4, 32],
		is:  /^[a-z0-9\-_\.]{4,32}$/i,
		notIn: ['root', 'admin'],
		isUnique: true
	    },
	    default: "anonymous",
	    required: true
	},
	password: {
	    type: 'varchar',
	    length: 255,
	    validate: {
		validPassword: {
		    minLen: 8,
		    msg: 'Password not strong enough'
		}
	    },
	    required: 'Password not strong enough'
	},
	mail: {
	    type: 'varchar',
	    length: 255,
	    validate: {
		maxLen: 255
	    }
	}
    });
};
