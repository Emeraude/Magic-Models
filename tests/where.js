var aliases = require('./aliases.json');
var where = require('../lib/where.js');

exports.where = {
  standard: function(test) {
    test.equal('`id` = 42', where({id: 42}));
    test.equal('`id` = 42 AND `login` = "admin"', where({id: 42, login: 'admin'}));
    test.equal('`id` IN(1, 5)', where({id: [1, 5]}));
    test.equal('`id` BETWEEN 1 AND 5', where({id: {between: [1, 5]}}));
    test.equal('`id` > 5', where({id: {gt: 5}}));
    test.equal('`id` >= 5', where({id: {gte: 5}}));
    test.equal('`id` < 5', where({id: {lt: 5}}));
    test.equal('`id` <= 5', where({id: {lte: 5}}));
    test.equal('`id` != 5', where({id: {ne: 5}}));
    test.equal('`id` = 5', where({id: {eq: 5}}));
    test.equal('`id` NOT 5', where({id: {not: 5}}));
    test.equal('`login` LIKE "%admin%"', where({login: {like: "%admin%"}}));
    test.equal('`login` REGEXP "[a-z]*"', where({login: {match: /[a-z]*/i}}));
    test.equal('((`id` = 5) OR (`login` = "admin"))', where({or: [{id: 5}, {login: "admin"}]}));
    test.equal('((`type` = "dog" AND `color` = "white" AND `size` = "large") OR (`type` = "cat" AND ((`size` = "small") OR (`color` = "black"))))', where({or:[{type: 'dog', color: 'white', size: 'large'}, {type: 'cat', or: [{size: 'small'}, {color: 'black'}]}]}));
    test.done();
  },

  aliases: function(test) {
    test.equal('`ID` = 42', where({id: 42}, aliases));
    test.equal('`ID` = 42 AND `userName` = "admin"', where({id: 42, login: 'admin'}, aliases));
    test.equal('`ID` IN(1, 5)', where({id: [1, 5]}, aliases));
    test.equal('`ID` BETWEEN 1 AND 5', where({id: {between: [1, 5]}}, aliases));
    test.equal('`ID` > 5', where({id: {gt: 5}}, aliases));
    test.equal('`ID` >= 5', where({id: {gte: 5}}, aliases));
    test.equal('`ID` < 5', where({id: {lt: 5}}, aliases));
    test.equal('`ID` <= 5', where({id: {lte: 5}}, aliases));
    test.equal('`ID` != 5', where({id: {ne: 5}}, aliases));
    test.equal('`ID` = 5', where({id: {eq: 5}}, aliases));
    test.equal('`ID` NOT 5', where({id: {not: 5}}, aliases));
    test.equal('`userName` LIKE "%admin%"', where({login: {like: "%admin%"}}, aliases));
    test.equal('`userName` REGEXP "[a-z]*"', where({login: {match: /[a-z]*/i}}, aliases));
    test.equal('((`ID` = 5) OR (`userName` = "admin"))', where({or: [{id: 5}, {login: "admin"}]}, aliases));
    test.equal('((`type` = "dog" AND `color` = "white" AND `size` = "large") OR (`type` = "cat" AND ((`size` = "small") OR (`color` = "black"))))', where({or:[{type: 'dog', color: 'white', size: 'large'}, {type: 'cat', or: [{size: 'small'}, {color: 'black'}]}]}, aliases));
    test.done();
  },

  randomCase: function(test) {
    test.equal('`id` BETWEEN 1 AND 5', where({id: {betWEEn: [1, 5]}}));
    test.equal('`id` > 5', where({id: {gT: 5}}));
    test.equal('`id` >= 5', where({id: {GTe: 5}}));
    test.equal('`id` < 5', where({id: {lT: 5}}));
    test.equal('`id` <= 5', where({id: {lTe: 5}}));
    test.equal('`id` != 5', where({id: {nE: 5}}));
    test.equal('`id` = 5', where({id: {eQ: 5}}));
    test.equal('`id` NOT 5', where({id: {NOt: 5}}));
    test.equal('`login` LIKE "%admin%"', where({login: {lIKe: "%admin%"}}));
    test.equal('`login` REGEXP "[a-z]*"', where({login: {maTCH: /[a-z]*/i}}));
    test.equal('((`id` = 5) OR (`login` = "admin"))', where({oR: [{id: 5}, {login: "admin"}]}));
    test.done();
  }
}
