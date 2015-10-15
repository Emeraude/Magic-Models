var aliases = require('./aliases.json');

var queryBuilder = require('../lib/queryBuilder.js');
exports.queryBuilder = {
  where: function(test) {
    test.equal(' WHERE `id` = 42 AND `login` = "admin"', queryBuilder({where: {id: 42, login: 'admin'}}));
    test.done();
  },

  group: function(test) {
    test.equal(' GROUP BY `login`', queryBuilder({group: 'login'}));
    test.equal(' GROUP BY `login`, `mail`', queryBuilder({group: ['login', 'mail']}));
    test.equal(' GROUP BY `userName`', queryBuilder({group: 'login'}, aliases));
    test.equal(' GROUP BY `userName`, `email`', queryBuilder({group: ['login', 'mail']}, aliases));
    test.done();
  },

  order: {
    standard: function(test) {
      test.equal(' ORDER BY `login` ASC', queryBuilder({order: {login: 'asc'}}));
      test.equal(' ORDER BY `login` ASC, `mail` DESC', queryBuilder({order: {login: 'asc', mail: 'desc'}}));
      test.equal(' ORDER BY `userName` ASC', queryBuilder({order: {login: 'asc'}}, aliases));
      test.equal(' ORDER BY `userName` ASC, `email` DESC', queryBuilder({order: {login: 'asc', mail: 'desc'}}, aliases));
      test.done();
    },
    randomCase: function(test) {
      test.equal(' ORDER BY `login` ASC', queryBuilder({order: {login: 'ASc'}}));
      test.equal(' ORDER BY `login` ASC, `mail` DESC', queryBuilder({order: {login: 'aSC', mail: 'Desc'}}));
      test.equal(' ORDER BY `userName` ASC', queryBuilder({order: {login: 'aSc'}}, aliases));
      test.equal(' ORDER BY `userName` ASC, `email` DESC', queryBuilder({order: {login: 'asC', mail: 'DESc'}}, aliases));
      test.done();
    }
  },

  limit: function(test) {
    test.equal(' LIMIT 5', queryBuilder({limit: 5}));
    test.equal(' LIMIT 5 OFFSET 2', queryBuilder({limit: 5, offset: 2}));
    test.equal('', queryBuilder({offset: 2}));
    test.done();
  },

  full: function(test) {
    test.equal(' WHERE `id` = 42 AND `login` = "admin" GROUP BY `login`, `mail` ORDER BY `login` ASC, `mail` DESC LIMIT 5 OFFSET 2', queryBuilder({where: {id: 42, login: 'admin'}, group: ['login', 'mail'], order: {login: 'asc', mail: 'desc'}, limit: 5, offset: 2}));
    test.equal(' WHERE `ID` = 42 AND `userName` = "admin" GROUP BY `userName`, `email` ORDER BY `userName` ASC, `email` DESC LIMIT 5 OFFSET 2', queryBuilder({where: {id: 42, login: 'admin'}, group: ['login', 'mail'], order: {login: 'asc', mail: 'desc'}, limit: 5, offset: 2}, aliases));
    test.done();
  }
}
