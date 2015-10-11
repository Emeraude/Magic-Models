module.exports = function(db) {
  db.define('News', {
    id: {},
    userId: {},
    title: {},
    content: {
      required: true,
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
