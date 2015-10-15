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
  },

  len: function(args, cb) {
    var len = (args.checkedField.val + '').length;
    cb(len >= args.rule.val[0] && len <= args.rule.val[1]);
  },

  minLen: function(args, cb) {
    cb((args.checkedField.val + '').length >= args.rule.val);
  },

  maxLen: function(args, cb) {
    cb((args.checkedField.val + '').length <= args.rule.val);
  },

  between: function(args, cb) {
    var val = parseFloat(args.checkedField.val);
    cb(val >= args.rule.val[0] && val <= args.rule.val[1]);
  },

  min: function(args, cb) {
    cb(parseFloat(args.checkedField.val) >= args.rule.val);
  },

  max: function(args, cb) {
    cb(parseFloat(args.checkedField.val) <= args.rule.val);
  }
}
