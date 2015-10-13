module.exports = {
  is: function(args, cb) {
    cb((args.checkedField.val + '').match(args.rule.val) !== null);
  },

  not: function(args, cb) {
    cb((args.checkedField.val + '').match(args.rule.val) === null);
  },

  isIn: function(args, cb) {
    for (i in args.rule.val)
      if (args.rule.val[i] == args.checkedField.val)
	return cb(true);
    cb(false);
  },

  notIn: function(args, cb) {
    for (i in args.rule.val)
      if (args.rule.val[i] == args.checkedField.val)
	return cb(false);
    cb(true);
  }
}
