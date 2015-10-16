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
  },

  isIPv4: function(args, cb) {
    cb((args.checkedField.val + '').match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/) !== null);
  },

  isIPv6: function(args, cb) {
    cb((args.checkedField.val + '').match(/^::|^::1|^([a-f0-9]{1,4}::?){1,7}([a-f0-9]{1,4})$/i) !== null);
  },

  isIP: function(args, cb) {
    cb((args.checkedField.val + '').match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^::|^::1|^([a-f0-9]{1,4}::?){1,7}([a-f0-9]{1,4})$/i) !== null);
  }
}
