module.exports = function(db) {
  db.define('Message', {
    id: {},
    to: {},
    from: {},
    title: {
      required: true,
      validate: {
	len: [8, 255]
      }
    },
    content: {
      required: true,
      validate: {
	minLen: 50
      }
    }
  }, {
    modifiedAt: null
  });
};
