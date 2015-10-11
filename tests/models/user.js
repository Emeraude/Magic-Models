module.exports = function(db) {
  db.define('Member', {
    id: {},
    login: {
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
      validate: {
	validPassword: {
	  minLen: 8,
	  msg: 'Password not strong enough'
	}
      },
      required: 'Password not strong enough'
    },
    mail: {
      validate: {
	maxLen: 255
      }
    }
  });
};
